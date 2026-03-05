// Navbar scroll + Back to top visibility
const nav = document.getElementById('siteNav');
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    if (backToTopBtn) backToTopBtn.classList.toggle('visible', window.scrollY > 400);
});
(function() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav__links a').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && href.split('/').pop() === currentPage) link.classList.add('active');
    });
})();

// Scroll reveal
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Toast notifications
function showToast(msg, type) {
    var t = document.createElement('div');
    t.className = 'toast toast--' + (type || 'success');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.classList.add('toast--visible'); });
    setTimeout(function() { t.classList.remove('toast--visible'); setTimeout(function() { t.remove(); }, 300); }, 4000);
}

// === Supabase config ===
const SUPABASE_URL = 'https://axnongwefdafwflekysk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y';

// === i18n helpers for dynamic content ===
function getLang() { return localStorage.getItem('gungru-lang') || 'en'; }
var LOCALE_MAP = {
    en:'en-US', bo:'en-US', hi:'hi-IN', 'zh-TW':'zh-TW', kn:'kn-IN',
    fr:'fr-FR', es:'es-ES', dz:'en-US', ja:'ja-JP', mr:'mr-IN',
    ne:'ne-NP', ta:'ta-IN', te:'te-IN', vi:'vi-VN', 'zh-CN':'zh-CN'
};
function getLocale() { return LOCALE_MAP[getLang()] || 'en-US'; }

// Cache for i18n dict (loaded by i18n.js)
var _evtDict = null;
function getEvtDict() {
    if (_evtDict) return _evtDict;
    try {
        var lang = getLang();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../assets/lang/' + lang + '.json?v=260305', false);
        xhr.send();
        if (xhr.status === 200) _evtDict = JSON.parse(xhr.responseText);
    } catch(e) {}
    return _evtDict || {};
}
function t(key) {
    var dict = getEvtDict();
    var parts = key.split('.');
    var val = dict;
    for (var i = 0; i < parts.length; i++) {
        if (!val) return null;
        val = val[parts[i]];
    }
    return val || null;
}

// Get translated event field (from metadata.translations)
function getEventField(event, field) {
    var lang = getLang();
    if (lang !== 'en' && event.metadata && event.metadata.translations && event.metadata.translations[lang] && event.metadata.translations[lang][field]) {
        return event.metadata.translations[lang][field];
    }
    return event[field] || '';
}

const EVENT_ICONS = {
    'puja': '\uD83D\uDD6F\uFE0F', 'teaching': '\uD83D\uDCDA',
    'ceremony': '\u2728', 'meeting': '\uD83E\uDD1D',
    'celebration': '\uD83C\uDF89', 'retreat': '\uD83C\uDFD4\uFE0F',
    'debate': '\uD83D\uDDE3\uFE0F', 'general': '\u2638\uFE0F'
};

// === State ===
var allEventsData = [];
var eventsById = {};
var calYear, calMonth;
var currentModalEventId = null;
var currentModalEvent = null;

// === Utility functions ===
function formatEventDate(dateStr) {
    var d = new Date(dateStr);
    var loc = getLocale();
    return {
        month: d.toLocaleString(loc, { month: 'short' }).toUpperCase(),
        day: d.getDate(), year: d.getFullYear(),
        time: d.toLocaleString(loc, { hour: 'numeric', minute: '2-digit', hour12: true }),
        full: d.toLocaleString(loc, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
}
function formatDateRange(start, end) {
    var loc = getLocale();
    var s = new Date(start);
    var time = s.toLocaleString(loc, { hour: 'numeric', minute: '2-digit', hour12: true });
    if (!end) return time;
    var e = new Date(end);
    if (s.toDateString() === e.toDateString()) {
        return time + ' \u2013 ' + e.toLocaleString(loc, { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return time + ' \u2013 ' + e.toLocaleString(loc, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}
function truncate(text, maxLen) { return !text ? '' : text.length > maxLen ? text.substring(0, maxLen).trim() + '\u2026' : text; }
function esc(str) { if (!str) return ''; var d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

// === Build event card HTML ===
function buildEventCard(event, isPast) {
    var date = formatEventDate(event.start_date);
    var icon = EVENT_ICONS[event.event_type] || EVENT_ICONS['general'];
    var statusClass = event.status === 'ongoing' ? 'ongoing' : 'upcoming';
    var pastClass = isPast ? ' event-card--past' : '';
    var ongoingClass = event.status === 'ongoing' ? ' event-card--ongoing' : '';
    var badgeLabel = isPast ? (t('events.badge_completed') || 'Completed') : (event.status === 'ongoing' ? (t('events.badge_ongoing') || 'Ongoing') : (t('events.badge_upcoming') || 'Upcoming'));
    var badgeClass = isPast ? 'upcoming' : statusClass;
    var timeRange = formatDateRange(event.start_date, event.end_date);
    var evtTitle = getEventField(event, 'title');
    var evtDesc = getEventField(event, 'description');
    var evtLocation = getEventField(event, 'location');
    var metaHtml = '<span class="event-card__meta-item"><span class="event-card__meta-icon">\uD83D\uDD52</span> ' + esc(timeRange) + '</span>';
    if (evtLocation) metaHtml += '<span class="event-card__meta-item"><span class="event-card__meta-icon">\uD83D\uDCCD</span> ' + esc(evtLocation) + '</span>';

    return '<div class="event-card' + pastClass + ongoingClass + '">' +
        '<div class="event-card__date">' +
            '<span class="event-card__date-month">' + esc(date.month) + '</span>' +
            '<span class="event-card__date-day">' + date.day + '</span>' +
            '<span class="event-card__date-year">' + date.year + '</span>' +
        '</div>' +
        '<div class="event-card__dot"></div>' +
        '<div class="event-card__body" data-event-id="' + event.id + '" tabindex="0" role="button" aria-label="' + esc(evtTitle) + '">' +
            '<div class="event-card__top">' +
                '<span class="event-card__icon">' + icon + '</span>' +
                '<span class="event-card__title">' + esc(evtTitle) + '</span>' +
                '<span class="event-card__badge event-card__badge--' + badgeClass + '">' + badgeLabel + '</span>' +
            '</div>' +
            '<div class="event-card__meta">' + metaHtml + '</div>' +
            (evtDesc ? '<p class="event-card__description">' + esc(truncate(evtDesc, 200)) + '</p>' : '') +
        '</div>' +
    '</div>';
}

function togglePastEvents() {
    var toggle = document.getElementById('pastToggle');
    var container = document.getElementById('pastContainer');
    var text = document.getElementById('pastToggleText');
    var isOpen = toggle.classList.toggle('open');
    container.classList.toggle('open', isOpen);
    text.textContent = isOpen ? (t('events.past_toggle_hide') || 'Hide Past Events') : (t('events.past_toggle_show') || 'Show Past Events');
}

// === Calendar ===
function getMonthNames() {
    var str = t('events.cal_months');
    if (str) return str.split(',');
    return ['January','February','March','April','May','June','July','August','September','October','November','December'];
}
function getWeekdayNames() {
    var str = t('events.cal_weekdays_short');
    if (str) return str.split(',');
    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
}

function initCalendar() {
    var now = new Date();
    calYear = now.getFullYear();
    calMonth = now.getMonth();
    document.getElementById('calPrev').addEventListener('click', function() { navigateCalendar(-1); });
    document.getElementById('calNext').addEventListener('click', function() { navigateCalendar(1); });
    document.getElementById('calToday').addEventListener('click', function() {
        var now = new Date(); calYear = now.getFullYear(); calMonth = now.getMonth(); renderCalendar();
    });
    renderCalendar();
    document.getElementById('calendarSection').style.display = '';
}

function navigateCalendar(delta) {
    calMonth += delta;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
}

function getEventsForDate(year, month, day) {
    var dateStart = new Date(year, month, day, 0, 0, 0);
    var dateEnd = new Date(year, month, day, 23, 59, 59);
    return allEventsData.filter(function(evt) {
        var evtStart = new Date(evt.start_date);
        var evtEnd = evt.end_date ? new Date(evt.end_date) : evtStart;
        return evtStart <= dateEnd && evtEnd >= dateStart;
    });
}

function renderCalendar() {
    var monthNames = getMonthNames();
    var weekdayNames = getWeekdayNames();
    document.getElementById('calMonthLabel').textContent = monthNames[calMonth] + ' ' + calYear;
    // Update weekday headers
    var weekdayEl = document.querySelector('.cal-weekdays');
    if (weekdayEl) weekdayEl.innerHTML = weekdayNames.map(function(d) { return '<span>' + d + '</span>'; }).join('');
    var firstDay = new Date(calYear, calMonth, 1).getDay();
    var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    var daysInPrev = new Date(calYear, calMonth, 0).getDate();
    var today = new Date();
    var todayStr = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
    var totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    var html = '';

    for (var i = 0; i < totalCells; i++) {
        var day, isOtherMonth = false, cellYear = calYear, cellMonth = calMonth;
        if (i < firstDay) {
            day = daysInPrev - firstDay + i + 1;
            isOtherMonth = true;
            cellMonth = calMonth - 1;
            if (cellMonth < 0) { cellMonth = 11; cellYear--; }
        } else if (i >= firstDay + daysInMonth) {
            day = i - firstDay - daysInMonth + 1;
            isOtherMonth = true;
            cellMonth = calMonth + 1;
            if (cellMonth > 11) { cellMonth = 0; cellYear++; }
        } else {
            day = i - firstDay + 1;
        }

        var isToday = !isOtherMonth && (cellYear + '-' + cellMonth + '-' + day === todayStr);
        var dayEvents = isOtherMonth ? [] : getEventsForDate(cellYear, cellMonth, day);
        var hasEvents = dayEvents.length > 0;
        var classes = 'cal-day';
        if (isOtherMonth) classes += ' cal-day--other';
        if (isToday) classes += ' cal-day--today';
        if (hasEvents) classes += ' cal-day--has-events';

        html += '<div class="' + classes + '"' +
            (hasEvents ? ' data-date="' + cellYear + '-' + (cellMonth + 1) + '-' + day + '"' : '') +
            '>' + day;
        if (hasEvents) {
            html += '<div class="cal-day__dots">';
            var shown = Math.min(dayEvents.length, 3);
            for (var j = 0; j < shown; j++) {
                var type = dayEvents[j].event_type || 'general';
                html += '<div class="cal-day__dot cal-dot--' + type + '"></div>';
            }
            html += '</div>';
        }
        html += '</div>';
    }
    document.getElementById('calGrid').innerHTML = html;
}

// Calendar click -> open modal for first event on that day
document.getElementById('calGrid').addEventListener('click', function(e) {
    var dayEl = e.target.closest('.cal-day--has-events');
    if (!dayEl) return;
    var dateStr = dayEl.getAttribute('data-date');
    if (!dateStr) return;
    var parts = dateStr.split('-');
    var dayEvents = getEventsForDate(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    if (dayEvents.length > 0) openEventModal(dayEvents[0]);
});

// Timeline click -> open modal
document.addEventListener('click', function(e) {
    var card = e.target.closest('.event-card__body[data-event-id]');
    if (card) {
        var id = card.getAttribute('data-event-id');
        if (eventsById[id]) openEventModal(eventsById[id]);
    }
});

// Keyboard accessibility for event cards
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        var card = e.target.closest('.event-card__body[data-event-id]');
        if (card) {
            e.preventDefault();
            var id = card.getAttribute('data-event-id');
            if (eventsById[id]) openEventModal(eventsById[id]);
        }
    }
});

// === Event Detail Modal ===
function openEventModal(event) {
    currentModalEventId = event.id;
    currentModalEvent = event;
    var icon = EVENT_ICONS[event.event_type] || EVENT_ICONS['general'];
    var date = formatEventDate(event.start_date);
    var isPast = event.status === 'completed' || event.status === 'cancelled';
    var badgeLabel = isPast ? (t('events.badge_completed') || 'Completed') : (event.status === 'ongoing' ? (t('events.badge_ongoing') || 'Ongoing') : (t('events.badge_upcoming') || 'Upcoming'));
    var evtTitle = getEventField(event, 'title');
    var evtDesc = getEventField(event, 'description');
    var evtLocation = getEventField(event, 'location');

    document.getElementById('modalEventIcon').textContent = icon;
    document.getElementById('modalEventTitle').textContent = evtTitle;
    document.getElementById('modalEventBadge').textContent = badgeLabel;

    var metaHtml = '<div class="event-modal__meta-item">&#128197; ' + esc(date.full) + '</div>' +
        '<div class="event-modal__meta-item">&#128336; ' + esc(formatDateRange(event.start_date, event.end_date)) + '</div>';
    if (evtLocation) metaHtml += '<div class="event-modal__meta-item">&#128205; ' + esc(evtLocation) + '</div>';
    document.getElementById('modalEventMeta').innerHTML = metaHtml;
    document.getElementById('modalEventDesc').textContent = evtDesc || (t('events.no_details') || 'No additional details available.');

    // Suggested offering
    var offeringEl = document.getElementById('modalOffering');
    if (event.suggested_offering) {
        document.getElementById('modalOfferingText').textContent = (t('events.offering_prefix') || 'Suggested Offering:') + ' ' + event.suggested_offering;
        document.getElementById('modalDonateLink').href = 'donate.html?event=' + encodeURIComponent(event.title);
        offeringEl.style.display = '';
    } else {
        offeringEl.style.display = 'none';
    }

    // RSVP section — hide for past events
    var rsvpSection = document.getElementById('modalRsvpSection');
    if (isPast) {
        rsvpSection.style.display = 'none';
    } else {
        rsvpSection.style.display = '';
        document.getElementById('rsvpForm').style.display = '';
        document.getElementById('rsvpSuccess').style.display = 'none';
        document.getElementById('rsvpForm').reset();
        document.getElementById('rsvpSubmitBtn').disabled = false;
        document.getElementById('rsvpSubmitBtn').textContent = t('events.rsvp_submit') || 'Confirm RSVP';
        fetchRsvpCount(event.id);
    }

    document.getElementById('eventDetailModal').classList.add('event-modal--open');
    document.body.style.overflow = 'hidden';
}

function closeEventModal() {
    document.getElementById('eventDetailModal').classList.remove('event-modal--open');
    document.body.style.overflow = '';
}

document.getElementById('eventModalBackdrop').addEventListener('click', closeEventModal);
document.getElementById('eventModalClose').addEventListener('click', closeEventModal);
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeEventModal(); });

// === RSVP Count ===
function fetchRsvpCount(eventId) {
    fetch(SUPABASE_URL + '/rest/v1/event_rsvps?event_id=eq.' + eventId + '&status=eq.confirmed&select=id', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'count=exact' }
    }).then(function(r) {
        var range = r.headers.get('content-range');
        var total = range ? range.split('/')[1] : '0';
        var countEl = document.getElementById('modalRsvpCount');
        if (total === '0') countEl.textContent = t('events.rsvp_first') || 'Be the first to RSVP!';
        else if (total === '1') countEl.textContent = t('events.rsvp_count_one') || '1 person attending';
        else countEl.textContent = (t('events.rsvp_count_many') || '{count} people attending').replace('{count}', total);
    }).catch(function() {});
}

// === RSVP Submission ===
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!currentModalEventId) return;
    var fullName = document.getElementById('rsvpName').value.trim();
    var email = document.getElementById('rsvpEmail').value.trim();
    var phone = document.getElementById('rsvpPhone').value.trim();
    var btn = document.getElementById('rsvpSubmitBtn');
    btn.disabled = true;
    btn.textContent = t('events.rsvp_submitting') || 'Submitting...';

    fetch(SUPABASE_URL + '/rest/v1/event_rsvps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
            event_id: currentModalEventId,
            full_name: fullName,
            email: email,
            phone: phone || null
        })
    }).then(function(r) {
        btn.disabled = false;
        btn.textContent = t('events.rsvp_submit') || 'Confirm RSVP';
        if (r.ok) {
            document.getElementById('rsvpForm').style.display = 'none';
            document.getElementById('rsvpSuccess').style.display = 'block';
            showToast(t('events.rsvp_confirmed_toast') || 'RSVP confirmed! Check your email.', 'success');
            sendRsvpConfirmation(email, fullName, currentModalEvent);
            fetchRsvpCount(currentModalEventId);
        } else if (r.status === 409) {
            showToast(t('events.rsvp_already_toast') || 'You have already RSVPed for this event.', 'error');
        } else {
            showToast(t('events.rsvp_error_toast') || 'Something went wrong. Please try again.', 'error');
        }
    }).catch(function() {
        btn.disabled = false;
        btn.textContent = t('events.rsvp_submit') || 'Confirm RSVP';
        showToast(t('events.rsvp_network_toast') || 'Network error. Please try again.', 'error');
    });
});

function sendRsvpConfirmation(email, name, event) {
    var dateStr = new Date(event.start_date).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    fetch(SUPABASE_URL + '/functions/v1/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPABASE_KEY },
        body: JSON.stringify({
            to: email,
            subject: 'RSVP Confirmed: ' + event.title,
            body: 'Tashi Delek, ' + name + '!\n\n' +
                  'Your RSVP for "' + event.title + '" has been confirmed.\n\n' +
                  'Date: ' + dateStr + '\n' +
                  (event.location ? 'Location: ' + event.location + '\n' : '') +
                  '\nWe look forward to seeing you!\n\n' +
                  'With blessings,\nThe Monks of Gungru Khangtsen'
        })
    }).catch(function() {});
}

// === Generate Event JSON-LD structured data ===
function generateEventSchema(events) {
    var upcomingEvents = events.filter(function(evt) {
        var endDate = evt.end_date ? new Date(evt.end_date) : new Date(evt.start_date);
        return endDate >= new Date() && evt.status !== 'completed' && evt.status !== 'cancelled';
    });
    if (upcomingEvents.length === 0) return;

    var schemaEvents = upcomingEvents.map(function(evt) {
        var eventSchema = {
            "@type": "Event",
            "name": evt.title || '',
            "startDate": evt.start_date,
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "organizer": {
                "@type": "Organization",
                "name": "Gaden Shartse Gungru Khangtsen Monastery",
                "url": "https://gadengungru.github.io/Khangtsen/Gungru/en/index.html"
            }
        };
        if (evt.end_date) eventSchema.endDate = evt.end_date;
        if (evt.description) eventSchema.description = evt.description;
        if (evt.location) {
            eventSchema.location = {
                "@type": "Place",
                "name": evt.location,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Mundgod",
                    "addressRegion": "Karnataka",
                    "addressCountry": "IN"
                }
            };
        } else {
            eventSchema.location = {
                "@type": "Place",
                "name": "Gaden Shartse Gungru Khangtsen Monastery",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Mundgod",
                    "addressRegion": "Karnataka",
                    "postalCode": "581411",
                    "addressCountry": "IN"
                }
            };
        }
        if (evt.metadata && evt.metadata.image_url) {
            eventSchema.image = evt.metadata.image_url;
        }
        return eventSchema;
    });

    var schema = {
        "@context": "https://schema.org",
        "@graph": schemaEvents
    };

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// === Fetch and render events ===
async function loadEvents() {
    var loadingEl = document.getElementById('eventsLoading');
    var upcomingTimeline = document.getElementById('upcomingTimeline');
    var emptyEl = document.getElementById('eventsEmpty');
    var errorEl = document.getElementById('eventsError');
    var pastSection = document.getElementById('pastSection');
    var pastTimeline = document.getElementById('pastTimeline');

    try {
        var res = await fetch(SUPABASE_URL + '/rest/v1/events?select=*&order=start_date.asc', {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        if (!res.ok) throw new Error('Failed to fetch events');
        var events = await res.json();

        // Store globally
        allEventsData = events;
        eventsById = {};
        events.forEach(function(e) { eventsById[e.id] = e; });

        loadingEl.style.display = 'none';
        var now = new Date();
        var upcoming = [], past = [];

        events.forEach(function(evt) {
            var endDate = evt.end_date ? new Date(evt.end_date) : new Date(evt.start_date);
            var isPast = (evt.status === 'completed' || evt.status === 'cancelled') || (endDate < now && evt.status !== 'ongoing');
            if (isPast) past.push(evt); else upcoming.push(evt);
        });

        if (upcoming.length > 0) {
            upcomingTimeline.innerHTML = upcoming.map(function(e) { return buildEventCard(e, false); }).join('');
            upcomingTimeline.style.display = 'block';
        } else {
            emptyEl.style.display = 'block';
        }

        if (past.length > 0) {
            past.reverse();
            pastTimeline.innerHTML = past.map(function(e) { return buildEventCard(e, true); }).join('');
            pastSection.style.display = 'block';
        }

        // Initialize calendar after data is loaded
        initCalendar();

        // Generate Event JSON-LD structured data
        generateEventSchema(events);

    } catch (err) {
        console.error('[events] Failed to load:', err);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEvents);
} else {
    loadEvents();
}
