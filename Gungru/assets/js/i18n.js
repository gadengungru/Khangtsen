// i18n — Language switcher for Gungru Khangtsen static site
(function() {
    var LANGS = {
        en: { flag: '\uD83C\uDDEC\uD83C\uDDE7', name: 'English' },
        bo: { flag: '\uD83C\uDFF3\uFE0F', name: '\u0F56\u0F7C\u0F51\u0F0B\u0F66\u0F90\u0F51\u0F0B' },
        hi: { flag: '\uD83C\uDDEE\uD83C\uDDF3', name: '\u0939\u093F\u0928\u094D\u0926\u0940' },
        'zh-TW': { flag: '\uD83C\uDDF9\uD83C\uDDFC', name: '\u4E2D\u6587' },
        kn: { flag: '\uD83C\uDDEE\uD83C\uDDF3', name: '\u0C95\u0CA8\u0CCD\u0CA8\u0CA1' },
        fr: { flag: '\uD83C\uDDEB\uD83C\uDDF7', name: 'Fran\u00E7ais' },
        es: { flag: '\uD83C\uDDEA\uD83C\uDDF8', name: 'Espa\u00F1ol' },
        dz: { flag: '\uD83C\uDDE7\uD83C\uDDF9', name: '\u0F62\u0FAB\u0F7C\u0F44\u0F0B\u0F41' },
        ja: { flag: '\uD83C\uDDEF\uD83C\uDDF5', name: '\u65E5\u672C\u8A9E' },
        mr: { flag: '\uD83C\uDDEE\uD83C\uDDF3', name: '\u092E\u0930\u093E\u0920\u0940' },
        ne: { flag: '\uD83C\uDDF3\uD83C\uDDF5', name: '\u0928\u0947\u092A\u093E\u0932\u0940' },
        ta: { flag: '\uD83C\uDDEE\uD83C\uDDF3', name: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD' },
        te: { flag: '\uD83C\uDDEE\uD83C\uDDF3', name: '\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41' },
        vi: { flag: '\uD83C\uDDFB\uD83C\uDDF3', name: 'Ti\u1EBFng Vi\u1EC7t' },
        'zh-CN': { flag: '\uD83C\uDDF8\uD83C\uDDEC', name: '\u7B80\u4F53\u4E2D\u6587' }
    };

    var DEFAULT_LANG = 'en';
    var currentLang = localStorage.getItem('gungru-lang') || DEFAULT_LANG;
    var dictCache = {};

    // Build dropdown picker
    function buildPicker() {
        var wrapper = document.createElement('div');
        wrapper.className = 'lang-picker';

        // Toggle button
        var toggle = document.createElement('button');
        toggle.className = 'lang-picker__toggle';
        toggle.setAttribute('aria-haspopup', 'listbox');
        toggle.setAttribute('aria-expanded', 'false');
        updateToggle(toggle);
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            var open = wrapper.classList.toggle('lang-picker--open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        // Dropdown menu
        var menu = document.createElement('div');
        menu.className = 'lang-picker__menu';
        menu.setAttribute('role', 'listbox');

        Object.keys(LANGS).forEach(function(code) {
            var item = document.createElement('button');
            item.className = 'lang-picker__item' + (code === currentLang ? ' lang-picker__item--active' : '');
            item.setAttribute('role', 'option');
            item.setAttribute('data-lang', code);
            item.setAttribute('aria-selected', code === currentLang ? 'true' : 'false');
            item.innerHTML = '<span class="lang-picker__item-flag">' + LANGS[code].flag + '</span>' +
                '<span class="lang-picker__item-name">' + LANGS[code].name + '</span>';
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                switchLang(code);
                wrapper.classList.remove('lang-picker--open');
                toggle.setAttribute('aria-expanded', 'false');
            });
            menu.appendChild(item);
        });

        wrapper.appendChild(toggle);
        wrapper.appendChild(menu);

        // Close on outside click
        document.addEventListener('click', function() {
            wrapper.classList.remove('lang-picker--open');
            toggle.setAttribute('aria-expanded', 'false');
        });

        return wrapper;
    }

    function updateToggle(toggle) {
        var lang = LANGS[currentLang] || LANGS[DEFAULT_LANG];
        toggle.innerHTML = '<span class="lang-picker__toggle-flag">' + lang.flag + '</span>' +
            '<span class="lang-picker__toggle-label">Language</span>' +
            '<span class="lang-picker__toggle-arrow">&#9662;</span>';
        toggle.setAttribute('title', 'Language: ' + lang.name);
    }

    // Insert picker into navbar
    function insertPicker() {
        var nav = document.querySelector('.site-nav__inner');
        if (!nav) return;
        var picker = buildPicker();
        nav.appendChild(picker);
    }

    // Load dictionary
    function loadDict(lang) {
        if (dictCache[lang]) return Promise.resolve(dictCache[lang]);
        var prefix = '../assets/lang/';
        return fetch(prefix + lang + '.json')
            .then(function(r) { return r.json(); })
            .then(function(d) { dictCache[lang] = d; return d; });
    }

    // Get nested value from object by dot-separated key
    function getNestedValue(obj, key) {
        return key.split('.').reduce(function(o, k) { return o && o[k]; }, obj);
    }

    // Apply translations to DOM
    function applyTranslations(dict) {
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            var val = getNestedValue(dict, key);
            if (val) {
                var attr = el.getAttribute('data-i18n-attr');
                if (attr) {
                    el.setAttribute(attr, val);
                } else {
                    el.innerHTML = val;
                }
            }
        });
        document.documentElement.lang = currentLang;
    }

    // Switch language
    function switchLang(lang) {
        currentLang = lang;
        localStorage.setItem('gungru-lang', lang);

        // Update toggle button
        var toggle = document.querySelector('.lang-picker__toggle');
        if (toggle) updateToggle(toggle);

        // Update active item
        document.querySelectorAll('.lang-picker__item').forEach(function(item) {
            var isActive = item.getAttribute('data-lang') === lang;
            item.classList.toggle('lang-picker__item--active', isActive);
            item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Load and apply
        loadDict(lang).then(applyTranslations).catch(function() {
            if (lang !== DEFAULT_LANG) {
                loadDict(DEFAULT_LANG).then(applyTranslations);
            }
        });
    }

    // Initialize
    function init() {
        insertPicker();
        if (currentLang !== DEFAULT_LANG) {
            loadDict(currentLang).then(applyTranslations).catch(function() {});
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
