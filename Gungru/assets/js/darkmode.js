// Dark mode toggle
(function() {
    var STORAGE_KEY = 'gungru-dark-mode';

    // Check saved preference or system preference
    function isDarkMode() {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) return saved === 'true';
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Apply dark mode
    function applyDarkMode(dark) {
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem(STORAGE_KEY, dark);
        var btn = document.getElementById('darkModeToggle');
        if (btn) {
            btn.innerHTML = dark ? '&#9788;' : '&#9790;';
            btn.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }

    // Create toggle button
    function createToggle() {
        var nav = document.querySelector('.site-nav__inner');
        if (!nav) return;

        var btn = document.createElement('button');
        btn.id = 'darkModeToggle';
        btn.className = 'dark-mode-toggle';
        btn.setAttribute('aria-label', 'Toggle dark mode');
        btn.addEventListener('click', function() {
            applyDarkMode(!document.documentElement.classList.contains('dark'));
        });

        // Insert before the auth widget or at end of nav
        var authWidget = nav.querySelector('.auth-widget');
        if (authWidget) {
            nav.insertBefore(btn, authWidget);
        } else {
            nav.appendChild(btn);
        }
    }

    // Init
    function init() {
        applyDarkMode(isDarkMode());
        createToggle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
