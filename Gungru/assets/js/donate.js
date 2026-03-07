// ── Multi-Currency System ──
// Base amounts are in INR. Each currency has pre-computed rounded amounts
// that are close (~20%) to the INR equivalent, for clean display.

const CURRENCIES = {
    USD: { symbol: '$',  flag: '\u{1F1FA}\u{1F1F8}', amounts: [6, 12, 60, 120, 300, 600], monthlyAmounts: [1, 2, 12, 25, 60, 120], sponsorAmounts: { 3000: 35, 5000: 60, 2000: 25, 10000: 120, 25000: 300, 108: 1.50 } },
    EUR: { symbol: '\u20AC', flag: '\u{1F1EA}\u{1F1FA}', amounts: [5, 10, 50, 100, 250, 500], monthlyAmounts: [1, 2, 10, 20, 50, 100], sponsorAmounts: { 3000: 35, 5000: 55, 2000: 25, 10000: 110, 25000: 275, 108: 1.25 } },
    GBP: { symbol: '\u00A3', flag: '\u{1F1EC}\u{1F1E7}', amounts: [5, 10, 45, 90, 250, 500], monthlyAmounts: [1, 2, 9, 18, 50, 100], sponsorAmounts: { 3000: 30, 5000: 50, 2000: 20, 10000: 100, 25000: 250, 108: 1 } },
    INR: { symbol: '\u20B9', flag: '\u{1F1EE}\u{1F1F3}', amounts: [500, 1000, 5000, 10000, 25000, 50000], monthlyAmounts: [100, 200, 1000, 2000, 5000, 10000], sponsorAmounts: { 3000: 3000, 5000: 5000, 2000: 2000, 10000: 10000, 25000: 25000, 108: 108 } },
    JPY: { symbol: '\u00A5', flag: '\u{1F1EF}\u{1F1F5}', amounts: [1000, 2000, 8000, 18000, 45000, 90000], monthlyAmounts: [200, 400, 1500, 3500, 9000, 18000], sponsorAmounts: { 3000: 5500, 5000: 9000, 2000: 3500, 10000: 18000, 25000: 45000, 108: 200 } },
    CNY: { symbol: '\u00A5', flag: '\u{1F1E8}\u{1F1F3}', amounts: [40, 80, 400, 850, 2000, 4000], monthlyAmounts: [8, 15, 80, 170, 400, 800], sponsorAmounts: { 3000: 260, 5000: 430, 2000: 170, 10000: 860, 25000: 2100, 108: 10 } },
    CAD: { symbol: '$',  flag: '\u{1F1E8}\u{1F1E6}', amounts: [8, 15, 80, 160, 400, 800], monthlyAmounts: [2, 3, 15, 30, 80, 160], sponsorAmounts: { 3000: 50, 5000: 80, 2000: 35, 10000: 170, 25000: 400, 108: 2 } },
    AUD: { symbol: '$',  flag: '\u{1F1E6}\u{1F1FA}', amounts: [10, 20, 90, 180, 450, 900], monthlyAmounts: [2, 4, 18, 35, 90, 180], sponsorAmounts: { 3000: 55, 5000: 90, 2000: 35, 10000: 180, 25000: 450, 108: 2 } },
    CHF: { symbol: 'Fr', flag: '\u{1F1E8}\u{1F1ED}', amounts: [5, 10, 50, 100, 250, 500], monthlyAmounts: [1, 2, 10, 20, 50, 100], sponsorAmounts: { 3000: 35, 5000: 55, 2000: 25, 10000: 110, 25000: 275, 108: 1.50 } },
    SGD: { symbol: '$',  flag: '\u{1F1F8}\u{1F1EC}', amounts: [8, 15, 80, 160, 400, 800], monthlyAmounts: [2, 3, 15, 30, 80, 160], sponsorAmounts: { 3000: 50, 5000: 80, 2000: 30, 10000: 160, 25000: 400, 108: 2 } },
    HKD: { symbol: '$',  flag: '\u{1F1ED}\u{1F1F0}', amounts: [50, 100, 450, 950, 2500, 5000], monthlyAmounts: [10, 20, 90, 190, 500, 1000], sponsorAmounts: { 3000: 280, 5000: 470, 2000: 190, 10000: 940, 25000: 2400, 108: 10 } },
    TWD: { symbol: '$',  flag: '\u{1F1F9}\u{1F1FC}', amounts: [200, 400, 2000, 4000, 10000, 20000], monthlyAmounts: [40, 80, 400, 800, 2000, 4000], sponsorAmounts: { 3000: 1100, 5000: 1800, 2000: 700, 10000: 3600, 25000: 9000, 108: 40 } }
};

// Language to default currency mapping
const LANG_CURRENCY = { en: 'USD', hi: 'INR', kn: 'INR', bo: 'INR', fr: 'EUR', es: 'EUR', 'zh-TW': 'TWD', 'zh-CN': 'CNY', vi: 'USD', dz: 'INR', ja: 'JPY', mr: 'INR', ne: 'INR', ta: 'INR', te: 'INR' };

// Detect language from localStorage (i18n), <html lang>, URL path, or default to 'en'
function detectLang() {
    // Check localStorage first — the i18n system stores the user's language choice here
    const storedLang = localStorage.getItem('gungru-lang') || '';
    if (storedLang && LANG_CURRENCY[storedLang]) return storedLang;
    const htmlLang = document.documentElement.lang || '';
    if (LANG_CURRENCY[htmlLang]) return htmlLang;
    const pathMatch = window.location.pathname.match(/\/([a-zA-Z]{2}(?:-[a-zA-Z]{2})?)\//);
    if (pathMatch && LANG_CURRENCY[pathMatch[1]]) return pathMatch[1];
    return 'en';
}

let currentCurrency = LANG_CURRENCY[detectLang()] || 'USD';

// Format amount for display
function fmtAmt(amount, currency) {
    const c = CURRENCIES[currency];
    if (currency === 'JPY' || (Number.isInteger(amount) && amount >= 100)) {
        return c.symbol + amount.toLocaleString();
    }
    if (amount < 1) return c.symbol + amount.toFixed(2);
    if (amount % 1 !== 0) return c.symbol + amount.toFixed(2);
    return c.symbol + amount.toLocaleString();
}

// Check if monthly frequency is active
function isMonthlyActive() {
    const activeBtn = document.querySelector('.freq-toggle__btn.active');
    return activeBtn && activeBtn.dataset.freq === 'monthly';
}

// Build preset amount grid
function buildAmountGrid(currency) {
    const grid = document.getElementById('amountGrid');
    const c = CURRENCIES[currency];
    grid.innerHTML = '';
    const amts = isMonthlyActive() ? c.monthlyAmounts : c.amounts;
    amts.forEach((amt, i) => {
        const id = 'amt' + (i + 1);
        const radio = document.createElement('input');
        radio.type = 'radio'; radio.id = id; radio.name = 'amount'; radio.value = amt;
        const label = document.createElement('label');
        label.htmlFor = id;
        const mainSpan = document.createElement('span');
        mainSpan.className = 'amount-main';
        mainSpan.textContent = fmtAmt(amt, currency);
        const codeSpan = document.createElement('span');
        codeSpan.className = 'amount-code';
        codeSpan.textContent = currency;
        label.appendChild(mainSpan);
        label.appendChild(codeSpan);
        grid.appendChild(radio);
        grid.appendChild(label);
    });
}

// Update sponsorship cards
function updateSponsorCards(currency) {
    const c = CURRENCIES[currency];
    document.querySelectorAll('.sponsor-card').forEach(card => {
        const actionEl = card.querySelector('.sponsor-card__action');
        if (!actionEl) return;
        const onclickStr = actionEl.getAttribute('onclick');
        const match = onclickStr && onclickStr.match(/selectSponsor\((\d+)/);
        if (!match) return;
        const inrAmt = parseInt(match[1]);
        const localAmt = c.sponsorAmounts[inrAmt];
        if (localAmt === undefined) return;
        const priceEl = card.querySelector('.sponsor-card__price');
        if (!priceEl) return;
        const inrSpan = priceEl.querySelector('.inr');
        const usdSpan = priceEl.querySelector('.usd');
        if (currency === 'INR') {
            if (inrSpan) inrSpan.textContent = fmtAmt(localAmt, currency);
            if (usdSpan) usdSpan.textContent = '';
        } else {
            if (inrSpan) inrSpan.textContent = fmtAmt(localAmt, currency);
            if (usdSpan) usdSpan.textContent = '';
        }
    });
}

// Change currency
function changeCurrency(currency) {
    currentCurrency = currency;
    buildAmountGrid(currency);
    updateSponsorCards(currency);
    document.getElementById('customCurrencyLabel').textContent = currency;
    document.getElementById('customAmount').value = '';
}

// Initialize on load
function initCurrency() {
    const select = document.getElementById('donationCurrency');
    select.value = currentCurrency;
    changeCurrency(currentCurrency);
}

// Re-detect currency when language is switched (i18n updates <html lang>)
new MutationObserver(function() {
    const newLang = document.documentElement.lang;
    if (newLang && LANG_CURRENCY[newLang]) {
        const newCurrency = LANG_CURRENCY[newLang];
        if (newCurrency !== currentCurrency) {
            currentCurrency = newCurrency;
            const select = document.getElementById('donationCurrency');
            select.value = currentCurrency;
            changeCurrency(currentCurrency);
        }
    }
}).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

// ── Core Functions ──

// Navbar scroll
const nav = document.getElementById('siteNav');
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    if (backToTopBtn) backToTopBtn.classList.toggle('visible', window.scrollY > 400);
});
// Active nav state
(function() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav__links a').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && href.split('/').pop() === currentPage) {
            link.classList.add('active');
        }
    });
})();
if (backToTopBtn) backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Frequency toggle
function toggleFreq(btn) {
    document.querySelectorAll('.freq-toggle__btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    document.getElementById('monthlyNote').style.display = btn.dataset.freq === 'monthly' ? 'block' : 'none';
    buildAmountGrid(currentCurrency);
}

// Clear presets
function clearPresets() {
    document.querySelectorAll('.amount-grid input[type="radio"]').forEach(r => { r.checked = false; });
}

// Handle donate (demo)
function handleDonate() {
    const selected = document.querySelector('.amount-grid input[type="radio"]:checked');
    const custom = document.getElementById('customAmount').value;
    const isMonthly = document.querySelector('.freq-toggle__btn.active').dataset.freq === 'monthly';
    let amount = '';
    if (selected) {
        amount = fmtAmt(parseFloat(selected.value), currentCurrency);
    } else if (custom) {
        amount = fmtAmt(parseFloat(custom), currentCurrency);
    } else {
        showToast('Please select or enter a donation amount.', 'info');
        return;
    }
    showToast('Thank you! In production, payment would open for ' + amount + ' ' + currentCurrency + (isMonthly ? ' monthly' : '') + '.', 'success');
}

// Sponsor card click
function selectSponsor(inrAmount) {
    document.getElementById('donate').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        if (inrAmount >= 2000) toggleFreq(document.querySelector('.freq-toggle__btn[data-freq="monthly"]'));
        const c = CURRENCIES[currentCurrency];
        const localAmt = c.sponsorAmounts[inrAmount];
        const radio = document.querySelector('.amount-grid input[value="' + localAmt + '"]');
        if (radio) { radio.checked = true; document.getElementById('customAmount').value = ''; }
        else { clearPresets(); document.getElementById('customAmount').value = localAmt; }
    }, 500);
}

// Form submit — save donor info to contacts table
function handleFormSubmit(e) {
    e.preventDefault();
    var btn = e.target.querySelector('button[type="submit"]');
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    var donorName = (document.getElementById('donorName').value || '').trim();
    var donorEmail = (document.getElementById('donorEmail').value || '').trim();
    var data = {
        full_name: donorName || null,
        email: donorEmail,
        phone: (document.getElementById('donorPhone').value || '').trim() || null,
        contact_type: 'donor',
        status: 'active',
        subscribed: document.getElementById('updatesCheck').checked,
        metadata: {
            country: document.getElementById('donorCountry').value || null,
            dedication_type: document.getElementById('donorDedication').value || null,
            dedication_name: (document.getElementById('dedicationName').value || '').trim() || null,
            message: (document.getElementById('donorMessage').value || '').trim() || null,
            is_anonymous: document.getElementById('anonCheck').checked,
            donation_currency: currentCurrency,
            donation_amount: document.getElementById('customAmount').value || selectedAmount || null
        }
    };

    fetch('https://axnongwefdafwflekysk.supabase.co/rest/v1/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': 'sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y',
            'Authorization': 'Bearer sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
    }).then(function(r) {
        btn.disabled = false;
        btn.textContent = originalText;
        if (r.ok) {
            showToast('Thank you, ' + (donorName || 'Friend') + '! Your information has been saved.', 'success');
            e.target.reset();
            initCurrency();
        } else {
            showToast('Something went wrong. Please try again or contact us.', 'error');
        }
    }).catch(function() {
        btn.disabled = false;
        btn.textContent = originalText;
        showToast('Network error. Please check your connection and try again.', 'error');
    });
}

// Copy to clipboard
function copyToClipboard(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    });
}

// Dedication field toggle
document.getElementById('donorDedication').addEventListener('change', function() {
    document.getElementById('dedicationNameWrap').style.display = this.value ? 'flex' : 'none';
});

// Toast notification
function showToast(message, type) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-10px);z-index:10000;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:500;font-family:DM Sans,sans-serif;max-width:90vw;text-align:center;opacity:0;transition:all 0.3s ease;box-shadow:0 8px 32px rgba(0,0,0,0.12);';
    if (type === 'success') { toast.style.background = '#f0fdf4'; toast.style.color = '#166534'; toast.style.border = '1px solid #bbf7d0'; }
    else { toast.style.background = '#fffbeb'; toast.style.color = '#92400e'; toast.style.border = '1px solid #fde68a'; }
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; });
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(-10px)'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Initialize currency on page load
initCurrency();
