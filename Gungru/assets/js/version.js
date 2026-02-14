// Fetch site version from Supabase settings table and display in footer
(function() {
    var el = document.querySelector('.footer-version');
    if (!el) return;
    var fallback = el.textContent;
    var url = 'https://axnongwefdafwflekysk.supabase.co/rest/v1/settings?key=eq.site_version&select=value';
    fetch(url, {
        headers: {
            'apikey': 'sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y',
            'Accept': 'application/json'
        }
    }).then(function(r) { return r.json(); }).then(function(rows) {
        if (!rows || !rows.length) return;
        var v = rows[0].value;
        var t = v.updated_at ? new Date(v.updated_at) : new Date();
        var ist = t.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });
        ist = ist.toLowerCase().replace(/\s/g, '').replace('am', 'a').replace('pm', 'p');
        el.textContent = 'v' + v.date + '.' + v.build + ' ' + ist;
    }).catch(function() { el.textContent = fallback; });
})();
