/**
 * Newsletter subscribe form handler
 * Saves subscriber to contacts table via Supabase REST API
 * Sends welcome email via Edge Function
 */
(function() {
    var SUPABASE_URL = 'https://axnongwefdafwflekysk.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y';

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

        fetch(SUPABASE_URL + '/rest/v1/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Prefer': 'return=minimal'
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
                note.textContent = 'Thank you for subscribing! Check your email for a welcome message.';
                note.style.color = '#bbf7d0';
                document.getElementById('subscribeEmail').value = '';
                // Send welcome email (fire and forget)
                sendWelcomeEmail(email);
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

    function sendWelcomeEmail(email) {
        try {
            fetch(SUPABASE_URL + '/functions/v1/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + SUPABASE_KEY
                },
                body: JSON.stringify({
                    to: email,
                    subject: 'Welcome to Gaden Shartse Gungru Khangtsen',
                    body: 'Tashi Delek! \ud83d\ude4f\n\nThank you for subscribing to updates from Gaden Shartse Gungru Khangtsen.\n\nWe are a monastic house within Gaden Shartse in Mundgod, India \u2014 home to over 30 monks dedicated to preserving Tibetan Buddhist wisdom through education, sacred arts, and compassionate action.\n\nAs a subscriber, you will receive:\n\n\u2022 News and updates from the khangtsen\n\u2022 Information about upcoming ceremonies and events\n\u2022 Teachings and reflections from our monks\n\u2022 Opportunities to support our community\n\nExplore our website:\n\u2022 Learn about Buddhism: https://gadengungru.github.io/Khangtsen/Gungru/en/general-understanding.html\n\u2022 Light a Butter Lamp: https://gadengungru.github.io/Khangtsen/Gungru/en/butter-lamp.html\n\u2022 Request a Puja: https://gadengungru.github.io/Khangtsen/Gungru/en/request-puja.html\n\u2022 Support our monks: https://gadengungru.github.io/Khangtsen/Gungru/en/donate.html\n\nMay all beings be happy and free from suffering.\n\nWith blessings,\nThe Monks of Gungru Khangtsen'
                })
            }).catch(function() { /* silent fail for welcome email */ });
        } catch (e) { /* silent fail */ }
    }
})();
