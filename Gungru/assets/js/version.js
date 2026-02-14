// ── Gungru Khangtsen — Version & Build Log ──
// Single source of truth for version display, hover, and changelog modal.

(function () {
    const VERSION = 'v260214.3';

    const CHANGELOG = [
        { version: 'v260214.3', date: '2026-02-14', summary: 'Add version system with hover, click modal, and build changelog' },
        { version: 'v260214.2', date: '2026-02-14', summary: 'Update version format' },
        { version: 'v260214.1', date: '2026-02-14', summary: 'Add multi-currency support with 12 currencies' },
        { version: 'v260213.1', date: '2026-02-13', summary: 'Initial site launch with home, general understanding, and donation pages' }
    ];

    function init() {
        // Inject version text into all .footer-version elements
        document.querySelectorAll('.footer-version').forEach(function (el) {
            el.textContent = VERSION;
            el.title = 'Click to view build history';
            el.style.cursor = 'pointer';
            el.addEventListener('click', openModal);
        });

        // Create modal (once)
        var overlay = document.createElement('div');
        overlay.className = 'version-modal-overlay';
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal();
        });

        var modal = document.createElement('div');
        modal.className = 'version-modal';

        var header = document.createElement('div');
        header.className = 'version-modal__header';
        header.innerHTML = '<span class="version-modal__title">Build History</span>' +
            '<button class="version-modal__close" aria-label="Close">&times;</button>';
        header.querySelector('.version-modal__close').addEventListener('click', closeModal);

        var list = document.createElement('div');
        list.className = 'version-modal__list';

        CHANGELOG.forEach(function (entry, i) {
            var item = document.createElement('div');
            item.className = 'version-modal__item' + (i === 0 ? ' version-modal__item--current' : '');
            item.innerHTML =
                '<div class="version-modal__item-header">' +
                    '<span class="version-modal__item-version">' + entry.version + '</span>' +
                    '<span class="version-modal__item-date">' + entry.date + '</span>' +
                '</div>' +
                '<div class="version-modal__item-summary">' + entry.summary + '</div>';
            list.appendChild(item);
        });

        modal.appendChild(header);
        modal.appendChild(list);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    function openModal() {
        var overlay = document.querySelector('.version-modal-overlay');
        if (overlay) overlay.classList.add('open');
    }

    function closeModal() {
        var overlay = document.querySelector('.version-modal-overlay');
        if (overlay) overlay.classList.remove('open');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
