// Navbar scroll + Back to top visibility
var nav = document.getElementById('siteNav');
var backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    if (backToTopBtn) backToTopBtn.classList.toggle('visible', window.scrollY > 400);
});
// Active nav state
(function() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav__links a').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && href.split('/').pop() === currentPage) {
            link.classList.add('active');
        }
    });
})();

// Scroll reveal with IntersectionObserver
var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(function(el) { revealObserver.observe(el); });

// Monks loader
(function() {
    var SUPABASE_URL = 'https://axnongwefdafwflekysk.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y';

    var grid = document.getElementById('monkGrid');
    var loading = document.getElementById('monksLoading');
    var fallback = document.getElementById('monksFallback');
    var statMonks = document.getElementById('statMonks');

    // Card observer for staggered reveal
    var cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    function renderMonks(monks) {
        if (!monks || monks.length === 0) {
            showFallback();
            return;
        }

        // Update stat count
        statMonks.textContent = monks.length;

        // Build cards
        grid.innerHTML = '';
        monks.forEach(function(monk, index) {
            var card = document.createElement('div');
            card.className = 'monk-card';
            card.style.transitionDelay = (index * 0.06) + 's';

            var photoHTML;
            if (monk.photo_url) {
                photoHTML = '<div class="monk-card__photo"><img src="' + escapeHTML(monk.photo_url) + '" alt="' + escapeHTML(monk.full_name) + '" loading="lazy"></div>';
            } else {
                photoHTML = '<div class="monk-card__photo"><span class="monk-card__photo-placeholder">&#9784;</span></div>';
            }

            var roleHTML = '';
            if (monk.role) {
                roleHTML = '<span class="monk-card__role">' + escapeHTML(formatRole(monk.role)) + '</span>';
            }

            card.innerHTML = photoHTML +
                '<div class="monk-card__name">' + escapeHTML(monk.full_name) + '</div>' +
                roleHTML;

            grid.appendChild(card);
            cardObserver.observe(card);
        });

        loading.style.display = 'none';
        grid.style.display = '';
    }

    function showFallback() {
        loading.style.display = 'none';
        grid.style.display = 'none';
        fallback.style.display = '';
    }

    function formatRole(role) {
        if (!role) return '';
        // Convert snake_case or camelCase to Title Case
        return role.replace(/[_-]/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    }

    function escapeHTML(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Fetch monks from Supabase REST API
    fetch(SUPABASE_URL + '/rest/v1/members?status=eq.active&select=id,full_name,photo_url,role&order=full_name.asc', {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Accept': 'application/json'
        }
    })
    .then(function(response) {
        if (!response.ok) throw new Error('API error: ' + response.status);
        return response.json();
    })
    .then(function(data) {
        renderMonks(data);
    })
    .catch(function(err) {
        console.warn('[monks] Failed to load:', err);
        showFallback();
    });
})();
