/**
 * Lightweight page view tracker for Gungru Khangtsen
 * Logs visits to Supabase page_views table via REST API
 * Privacy-friendly: no cookies, no fingerprinting, respects DNT
 */
(function() {
    // Respect Do Not Track
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

    // Don't track admin pages
    if (window.location.pathname.indexOf('/admin/') > -1) return;

    // Supabase REST API config
    var SUPABASE_URL = 'https://axnongwefdafwflekysk.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y';

    // Detect device type
    function getDeviceType() {
        var ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
        if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
        return 'desktop';
    }

    // Detect browser
    function getBrowser() {
        var ua = navigator.userAgent;
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('SamsungBrowser') > -1) return 'Samsung';
        if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
        if (ua.indexOf('Edg') > -1) return 'Edge';
        if (ua.indexOf('Chrome') > -1) return 'Chrome';
        if (ua.indexOf('Safari') > -1) return 'Safari';
        return 'Other';
    }

    // Detect OS
    function getOS() {
        var ua = navigator.userAgent;
        if (ua.indexOf('Android') > -1) return 'Android';
        if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
        if (ua.indexOf('Win') > -1) return 'Windows';
        if (ua.indexOf('Mac') > -1) return 'macOS';
        if (ua.indexOf('Linux') > -1) return 'Linux';
        return 'Other';
    }

    // Get timezone
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch(e) {}

    // Map timezone to approximate country
    function guessCountry(timezone) {
        if (!timezone) return null;
        var map = {
            'Asia/Kolkata': 'India', 'Asia/Calcutta': 'India',
            'America/New_York': 'USA', 'America/Chicago': 'USA', 'America/Denver': 'USA', 'America/Los_Angeles': 'USA',
            'Europe/London': 'UK', 'Europe/Paris': 'France', 'Europe/Berlin': 'Germany',
            'Australia/Sydney': 'Australia', 'Australia/Melbourne': 'Australia', 'Australia/Perth': 'Australia',
            'Asia/Tokyo': 'Japan', 'Asia/Shanghai': 'China', 'Asia/Hong_Kong': 'Hong Kong',
            'Asia/Singapore': 'Singapore', 'Asia/Taipei': 'Taiwan',
            'Asia/Kathmandu': 'Nepal', 'Asia/Thimphu': 'Bhutan',
            'America/Toronto': 'Canada', 'America/Vancouver': 'Canada',
            'Europe/Rome': 'Italy', 'Europe/Madrid': 'Spain', 'Europe/Zurich': 'Switzerland',
            'Asia/Bangkok': 'Thailand', 'Asia/Ho_Chi_Minh': 'Vietnam', 'Asia/Saigon': 'Vietnam',
            'Asia/Seoul': 'South Korea', 'Asia/Ulaanbaatar': 'Mongolia'
        };
        if (map[timezone]) return map[timezone];
        // Fallback: extract region from timezone
        var parts = timezone.split('/');
        if (parts.length > 1) return parts[1].replace(/_/g, ' ');
        return null;
    }

    // Build page view record
    var data = {
        page_path: window.location.pathname,
        page_title: document.title || null,
        referrer: document.referrer || null,
        device_type: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        country: guessCountry(tz),
        timezone: tz,
        language: (navigator.language || navigator.userLanguage || '').substring(0, 10),
        screen_width: window.screen ? window.screen.width : null
    };

    // Send to Supabase REST API (fire and forget)
    try {
        fetch(SUPABASE_URL + '/rest/v1/page_views', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(data)
        }).catch(function() {});
    } catch(e) {}
})();
