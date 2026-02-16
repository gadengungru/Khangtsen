// instagram-feed.js — Instagram feed for Gungru Khangtsen homepage
// Reads cached posts from Supabase settings (server-side cached, auto-refreshed)
(function() {
    'use strict';

    var INSTAGRAM_PROFILE = 'https://www.instagram.com/gadengungru';
    var SUPABASE_URL = 'https://axnongwefdafwflekysk.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y';
    var LOCAL_CACHE_KEY = 'gungru-instagram-cache';
    var LOCAL_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

    var feedContainer = document.getElementById('instagramFeed');
    if (!feedContainer) return;

    // Local browser cache
    function getLocalCache() {
        try {
            var cached = JSON.parse(localStorage.getItem(LOCAL_CACHE_KEY));
            if (cached && Date.now() - cached.ts < LOCAL_CACHE_DURATION && cached.posts && cached.posts.length) {
                return cached.posts;
            }
        } catch (e) {}
        return null;
    }

    function setLocalCache(posts) {
        try {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify({ ts: Date.now(), posts: posts }));
        } catch (e) {}
    }

    // Fetch cached posts from Supabase settings (no token exposed)
    function fetchCachedFeed() {
        return fetch(SUPABASE_URL + '/rest/v1/settings?key=eq.instagram_feed_cache&select=value', {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY
            }
        })
        .then(function(r) { return r.json(); })
        .then(function(rows) {
            if (rows && rows.length && rows[0].value) {
                var val = rows[0].value;
                // Handle both string and object
                if (typeof val === 'string') {
                    val = JSON.parse(val);
                }
                return val.posts || [];
            }
            return [];
        });
    }

    // Render feed grid
    function renderFeed(posts) {
        feedContainer.innerHTML = '';
        var count = 0;
        posts.forEach(function(post) {
            var imgUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
            if (!imgUrl || count >= 6) return;
            count++;

            var item = document.createElement('a');
            item.className = 'instagram-feed__item reveal';
            item.href = post.permalink || INSTAGRAM_PROFILE;
            item.target = '_blank';
            item.rel = 'noopener';

            var caption = post.caption ? post.caption.substring(0, 80) : 'Instagram post';
            item.setAttribute('aria-label', caption);

            var img = document.createElement('img');
            img.src = imgUrl;
            img.alt = caption;
            img.loading = 'lazy';

            var overlay = document.createElement('div');
            overlay.className = 'instagram-feed__overlay';
            overlay.innerHTML = '<span>&#9654; View</span>';

            item.appendChild(img);
            item.appendChild(overlay);
            feedContainer.appendChild(item);
        });

        // Scroll reveal animation
        if (window.IntersectionObserver) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            }, { threshold: 0.1 });
            feedContainer.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
        }
    }

    // Render fallback — beautiful placeholder grid linking to Instagram
    function renderFallback() {
        feedContainer.innerHTML = '';
        var errorDiv = document.createElement('div');
        errorDiv.className = 'instagram-feed__error';

        var grid = document.createElement('div');
        grid.className = 'instagram-feed__error-grid';

        var emojis = ['\uD83D\uDE4F', '\uD83C\uDF04', '\u2638', '\uD83C\uDFA8', '\uD83D\uDCD6', '\uD83C\uDF0E'];
        for (var i = 0; i < 6; i++) {
            var placeholder = document.createElement('a');
            placeholder.href = INSTAGRAM_PROFILE;
            placeholder.target = '_blank';
            placeholder.rel = 'noopener';
            placeholder.className = 'instagram-feed__placeholder';
            placeholder.textContent = emojis[i];
            placeholder.setAttribute('aria-label', 'Visit our Instagram');
            grid.appendChild(placeholder);
        }

        errorDiv.appendChild(grid);
        feedContainer.style.display = 'block';
        feedContainer.appendChild(errorDiv);
    }

    // Main flow
    function init() {
        // Try local browser cache first
        var cached = getLocalCache();
        if (cached) {
            renderFeed(cached);
            return;
        }

        // Fetch from Supabase server cache
        fetchCachedFeed()
            .then(function(posts) {
                if (!posts || !posts.length) throw new Error('No posts');
                setLocalCache(posts);
                renderFeed(posts);
            })
            .catch(function() {
                renderFallback();
            });
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
