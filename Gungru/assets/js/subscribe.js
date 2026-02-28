/**
 * Newsletter subscribe form handler
 * Saves subscriber to contacts table via Supabase REST API
 */
(function() {
    var form = document.getElementById('subscribeForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('subscribeEmail').value.trim();
        var btn = document.getElementById('subscribeBtn');
        var note = document.getElementById('subscribeNote');
        if (!email) return;

        btn.disabled = true;
        btn.textContent = '...';

        fetch('https://axnongwefdafwflekysk.supabase.co/rest/v1/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y',
                'Authorization': 'Bearer sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y',
                'Prefer': 'resolution=merge-duplicates,return=minimal'
            },
            body: JSON.stringify({
                email: email,
                contact_type: 'subscriber',
                status: 'active',
                subscribed: true
            })
        }).then(function(r) {
            btn.disabled = false;
            btn.textContent = 'Subscribe';
            if (r.ok) {
                note.textContent = 'Thank you for subscribing!';
                note.style.color = '#bbf7d0';
                document.getElementById('subscribeEmail').value = '';
            } else {
                note.textContent = 'Something went wrong. Please try again.';
                note.style.color = '#fecaca';
            }
        }).catch(function() {
            btn.disabled = false;
            btn.textContent = 'Subscribe';
            note.textContent = 'Connection error. Please try again.';
            note.style.color = '#fecaca';
        });
    });
})();
