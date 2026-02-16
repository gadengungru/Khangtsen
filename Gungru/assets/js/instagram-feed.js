// instagram-feed.js — Instagram feed for Gungru Khangtsen homepage
(function() {
    'use strict';

    var INSTAGRAM_PROFILE = 'https://www.instagram.com/gadengungru';
    var SUPABASE_URL = 'https://axnongwefdafwflekysk.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y';
    var CACHE_KEY = 'gungru-instagram-cache';
    var CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
    var POST_COUNT = 6;

    var feedContainer = document.getElementById('instagramFeed');
    if (!feedContainer) return;

    // Check cache first
    function getCached() {
        try {
            var cached = JSON.parse(localStorage.getItem(CACHE_KEY));
            if (cached && Date.now() - cached.ts < CACHE_DURATION && cached.posts && cached.posts.length) {
                return cached.posts;
            }
        } catch (e) {}
        return null;
    }

    function setCache(posts) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), posts: posts }));
        } catch (e) {}
    }

    // Fetch Instagram token from Supabase settings
    function fetchToken() {
        return fetch(SUPABASE_URL + '/rest/v1/settings?key=eq.instagram_token&select=value', {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY
            }
        })
        .then(function(r) { return r.json(); })
        .then(function(rows) {
            if (rows && rows.length && rows[0].value) {
                var val = rows[0].value;
                // value might be JSON string with {token: "..."} or plain string
                if (typeof val === 'string') {
                    try {
                        var parsed = JSON.parse(val);
                        return parsed.token || parsed.access_token || val;
                    } catch (e) {
                        return val;
                    }
                }
                return val.token || val.access_token || null;
            }
            return null;
        });
    }

    // Fetch posts from Instagram Graph API
    function fetchPosts(token) {
        var url = 'https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=' + POST_COUNT + '&access_token=' + token;
        return fetch(url)
            .then(function(r) {
                if (!r.ok) throw new Error('Instagram API error: ' + r.status);
                return r.json();
            })
            .then(function(data) {
                return data.data || [];
            });
    }

    // Render feed grid
    function renderFeed(posts) {
        feedContainer.innerHTML = '';
        posts.forEach(function(post) {
            var imgUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
            if (!imgUrl) return;

            var item = document.createElement('a');
            item.className = 'instagram-feed__item reveal';
            item.href = post.permalink || INSTAGRAM_PROFILE;
            item.target = '_blank';
            item.rel = 'noopener';
            item.setAttribute('aria-label', post.caption ? post.caption.substring(0, 80) : 'Instagram post');

            var img = document.createElement('img');
            img.src = imgUrl;
            img.alt = post.caption ? post.caption.substring(0, 100) : 'Instagram post';
            img.loading = 'lazy';

            var overlay = document.createElement('div');
            overlay.className = 'instagram-feed__overlay';
            overlay.innerHTML = '<span>&#10084; View</span>';

            item.appendChild(img);
            item.appendChild(overlay);
            feedContainer.appendChild(item);
        });

        // Re-observe for scroll reveal
        if (window.IntersectionObserver) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            }, { threshold: 0.1 });
            feedContainer.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
        }
    }

    // Render fallback — beautiful placeholder grid
    function renderFallback() {
        feedContainer.innerHTML = '';
        var errorDiv = document.createElement('div');
        errorDiv.className = 'instagram-feed__error';

        var grid = document.createElement('div');
        grid.className = 'instagram-feed__error-grid';

        var emojis = ['&#128591;', '&#127748;', '&#9784;', '&#127912;', '&#128214;', '&#127760;'];
        for (var i = 0; i < 6; i++) {
            var placeholder = document.createElement('a');
            placeholder.href = INSTAGRAM_PROFILE;
            placeholder.target = '_blank';
            placeholder.rel = 'noopener';
            placeholder.className = 'instagram-feed__placeholder';
            placeholder.innerHTML = emojis[i];
            placeholder.setAttribute('aria-label', 'Visit our Instagram');
            grid.appendChild(placeholder);
        }

        errorDiv.appendChild(grid);
        feedContainer.innerHTML = '';
        feedContainer.style.display = 'block';
        feedContainer.appendChild(errorDiv);
    }

    // Main flow
    function init() {
        // Try cache first
        var cached = getCached();
        if (cached) {
            renderFeed(cached);
            // Refresh in background
            refreshInBackground();
            return;
        }

        // Fetch fresh
        fetchToken()
            .then(function(token) {
                if (!token) throw new Error('No Instagram token');
                return fetchPosts(token);
            })
            .then(function(posts) {
                if (!posts || !posts.length) throw new Error('No posts');
                setCache(posts);
                renderFeed(posts);
            })
            .catch(function() {
                renderFallback();
            });
    }

    function refreshInBackground() {
        fetchToken()
            .then(function(token) {
                if (!token) return;
                return fetchPosts(token);
            })
            .then(function(posts) {
                if (posts && posts.length) setCache(posts);
            })
            .catch(function() {});
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
