(function() {
    var sb = window.adminSupabase;
    if (!sb) return;

    var LAST_SEEN_KEY = 'admin_notif_last_seen';
    var lastSeen = localStorage.getItem(LAST_SEEN_KEY);
    if (!lastSeen) lastSeen = new Date(Date.now() - 7 * 86400000).toISOString();

    var bell = document.getElementById('notifBell');
    var badge = document.getElementById('notifBadge');
    var dropdown = document.getElementById('notifDropdown');
    var list = document.getElementById('notifList');
    if (!bell || !badge || !dropdown || !list) return;

    function escHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

    function timeAgo(dateStr) {
        var diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
        if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
        return Math.floor(diff / 86400) + 'd ago';
    }

    Promise.all([
        sb.from('contacts').select('id, full_name, contact_type, created_at')
            .in('contact_type', ['puja_request', 'donor', 'subscriber'])
            .gte('created_at', lastSeen)
            .order('created_at', { ascending: false }).limit(30),
        sb.from('event_rsvps').select('id, full_name, created_at')
            .gte('created_at', lastSeen)
            .order('created_at', { ascending: false }).limit(20)
    ]).then(function(results) {
        var contacts = results[0].data || [];
        var rsvps = results[1].data || [];

        var items = [];
        contacts.forEach(function(c) {
            var icon = c.contact_type === 'puja_request' ? '&#128591;' : c.contact_type === 'donor' ? '&#128176;' : '&#128231;';
            var label = c.contact_type === 'puja_request' ? 'Puja request' : c.contact_type === 'donor' ? 'Donation' : 'Subscriber';
            items.push({ icon: icon, text: label + ': ' + (c.full_name || 'Anonymous'), time: c.created_at, link: 'contacts.html' });
        });
        rsvps.forEach(function(r) {
            items.push({ icon: '&#128203;', text: 'RSVP: ' + (r.full_name || 'Guest'), time: r.created_at, link: 'rsvps.html' });
        });

        items.sort(function(a, b) { return new Date(b.time) - new Date(a.time); });
        items = items.slice(0, 20);

        var total = items.length;
        if (total > 0) {
            badge.style.display = 'flex';
            badge.textContent = total > 99 ? '99+' : total;
        }

        if (items.length === 0) {
            list.innerHTML = '<div style="padding:20px;text-align:center;color:#9ca3af;font-size:13px;">No new notifications</div>';
        } else {
            list.innerHTML = items.map(function(item) {
                return '<a href="' + item.link + '" style="display:flex;align-items:flex-start;gap:10px;padding:10px 16px;text-decoration:none;color:#374151;font-size:13px;border-bottom:1px solid #f9fafb;">' +
                    '<span>' + item.icon + '</span>' +
                    '<div><div style="line-height:1.4;">' + escHtml(item.text) + '</div><div style="font-size:11px;color:#9ca3af;margin-top:2px;">' + timeAgo(item.time) + '</div></div>' +
                '</a>';
            }).join('');
        }
    }).catch(function() {});

    bell.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = dropdown.style.display !== 'none';
        dropdown.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) {
            localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
            badge.style.display = 'none';
        }
    });

    document.addEventListener('click', function() {
        dropdown.style.display = 'none';
    });
})();
