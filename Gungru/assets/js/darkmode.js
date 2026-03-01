// darkmode.js — Shared dark mode toggle for all pages
(function() {
    'use strict';

    // Apply saved preference immediately (before paint)
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }

    function init() {
        var navLinks = document.querySelector('.site-nav__links');
        if (!navLinks) return;

        // Create nav toggle item
        var li = document.createElement('li');
        li.className = 'nav-dark-toggle';

        var btn = document.createElement('button');
        btn.className = 'dark-mode-nav-btn';
        btn.setAttribute('aria-label', 'Toggle dark mode');
        btn.title = 'Toggle dark mode';

        var isDark = document.documentElement.classList.contains('dark');
        btn.textContent = isDark ? '\u2600' : '\u263E';

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            document.documentElement.classList.toggle('dark');
            var nowDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('darkMode', nowDark);
            btn.textContent = nowDark ? '\u2600' : '\u263E';
        });

        li.appendChild(btn);

        // Insert before the Donate CTA (last li)
        var lastItem = navLinks.querySelector('.site-nav__cta');
        if (lastItem && lastItem.parentElement) {
            navLinks.insertBefore(li, lastItem.parentElement);
        } else {
            navLinks.appendChild(li);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
