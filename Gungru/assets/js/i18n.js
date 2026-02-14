// i18n — Language switcher for Gungru Khangtsen static site
(function() {
    var LANGS = {
        en: { flag: '\uD83C\uDDEC\uD83C\uDDE7', name: 'English' },
        bo: { flag: '\uD83C\uDFF3\uFE0F', name: '\u0F56\u0F7C\u0F51\u0F0B\u0F66\u0F90\u0F51\u0F0B' },
        hi: { flag: '\uD83C\uDDEE\uD83C\uDDF3', name: '\u0939\u093F\u0928\u094D\u0926\u0940' },
        zh: { flag: '\uD83C\uDDE8\uD83C\uDDF3', name: '\u4E2D\u6587' },
        kn: { flag: '\uD83C\uDDEE\uD83C\uDDF3', name: '\u0C95\u0CA8\u0CCD\u0CA8\u0CA1' },
        fr: { flag: '\uD83C\uDDEB\uD83C\uDDF7', name: 'Fran\u00E7ais' },
        es: { flag: '\uD83C\uDDEA\uD83C\uDDF8', name: 'Espa\u00F1ol' }
    };

    var DEFAULT_LANG = 'en';
    var currentLang = localStorage.getItem('gungru-lang') || DEFAULT_LANG;
    var dictCache = {};

    // Build language picker HTML
    function buildPicker() {
        var picker = document.createElement('div');
        picker.className = 'lang-picker';
        Object.keys(LANGS).forEach(function(code) {
            var btn = document.createElement('button');
            btn.className = 'lang-picker__btn' + (code === currentLang ? ' lang-picker__btn--active' : '');
            btn.setAttribute('data-lang', code);
            btn.setAttribute('title', LANGS[code].name);
            btn.setAttribute('aria-label', 'Switch to ' + LANGS[code].name);
            btn.textContent = LANGS[code].flag;
            btn.addEventListener('click', function() { switchLang(code); });
            picker.appendChild(btn);
        });
        return picker;
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
        // Resolve path relative to current page
        var base = document.querySelector('link[rel="stylesheet"]');
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
                // Check if element has data-i18n-attr (for attributes like placeholder, title, aria-label)
                var attr = el.getAttribute('data-i18n-attr');
                if (attr) {
                    el.setAttribute(attr, val);
                } else {
                    el.innerHTML = val;
                }
            }
        });

        // Update html lang attribute
        document.documentElement.lang = currentLang;
    }

    // Switch language
    function switchLang(lang) {
        currentLang = lang;
        localStorage.setItem('gungru-lang', lang);

        // Update active button
        document.querySelectorAll('.lang-picker__btn').forEach(function(btn) {
            btn.classList.toggle('lang-picker__btn--active', btn.getAttribute('data-lang') === lang);
        });

        // Load and apply
        loadDict(lang).then(applyTranslations).catch(function() {
            // Fallback to English
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
