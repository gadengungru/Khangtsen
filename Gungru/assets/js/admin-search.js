(function() {
    var sb = window.adminSupabase;
    if (!sb) return;

    var input = document.getElementById('globalSearchInput');
    var results = document.getElementById('globalSearchResults');
    if (!input || !results) return;

    var debounceTimer;

    function escHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            input.focus();
            input.select();
        }
        if (e.key === 'Escape') {
            input.blur();
            results.style.display = 'none';
        }
    });

    input.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        var q = input.value.trim();
        if (q.length < 2) { results.style.display = 'none'; return; }
        debounceTimer = setTimeout(function() { performSearch(q); }, 300);
    });

    input.addEventListener('focus', function() {
        if (input.value.trim().length >= 2) performSearch(input.value.trim());
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.admin-global-search')) results.style.display = 'none';
    });

    function performSearch(q) {
        var pattern = '%' + q + '%';
        Promise.all([
            sb.from('members').select('id, full_name, email, role').ilike('full_name', pattern).limit(5),
            sb.from('contacts').select('id, full_name, email, contact_type').ilike('full_name', pattern).limit(5),
            sb.from('events').select('id, title, event_type, status').ilike('title', pattern).limit(5),
            sb.from('transactions').select('id, description, amount, currency, transaction_type').ilike('description', pattern).limit(5)
        ]).then(function(res) {
            var items = [];
            (res[0].data || []).forEach(function(m) { items.push({ icon: '&#128100;', label: m.full_name, sub: m.role || 'member', link: 'members.html' }); });
            (res[1].data || []).forEach(function(c) { items.push({ icon: '&#128199;', label: c.full_name || c.email, sub: c.contact_type || 'contact', link: 'contacts.html' }); });
            (res[2].data || []).forEach(function(e) { items.push({ icon: '&#128197;', label: e.title, sub: e.event_type || 'event', link: 'events.html' }); });
            (res[3].data || []).forEach(function(t) { items.push({ icon: '&#128176;', label: t.description, sub: (t.transaction_type || '') + ' ' + (t.amount || ''), link: 'transactions.html' }); });

            if (items.length === 0) {
                results.innerHTML = '<div style="padding:20px;text-align:center;color:#9ca3af;font-size:13px;">No results found</div>';
            } else {
                results.innerHTML = items.map(function(item) {
                    return '<a href="' + item.link + '" style="display:flex;align-items:center;gap:10px;padding:10px 16px;text-decoration:none;color:#374151;font-size:13px;border-bottom:1px solid #f9fafb;">' +
                        '<span>' + item.icon + '</span>' +
                        '<div><div style="font-weight:600;">' + escHtml(item.label) + '</div><div style="font-size:11px;color:#9ca3af;">' + escHtml(item.sub) + '</div></div>' +
                    '</a>';
                }).join('');
            }
            results.style.display = 'block';
        }).catch(function() {});
    }
})();
