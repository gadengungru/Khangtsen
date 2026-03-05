/**
 * Daily Dharma Quote Widget
 * Displays a daily teaching from Nagarjuna or Shantideva
 * Deterministic selection based on day-of-year
 */
(function() {
    'use strict';

    var QUOTES = [
        // === SHANTIDEVA — Bodhicaryāvatāra (Guide to the Bodhisattva's Way of Life) ===
        { id: 1, text: "All the suffering in the world arises from seeking happiness for oneself. All the happiness in the world arises from seeking happiness for others.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 8" },
        { id: 2, text: "Where would I find enough leather to cover the entire surface of the earth? But with leather soles beneath my feet, it is as if the whole earth were covered.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 5" },
        { id: 3, text: "Whatever joy there is in this world, all comes from desiring others to be happy. Whatever suffering there is in this world, all comes from desiring myself to be happy.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 8" },
        { id: 4, text: "For those who fail to exchange their own happiness for the suffering of others, Buddhahood is certainly impossible — how could there even be happiness in ordinary existence?", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 8" },
        { id: 5, text: "If the problem can be solved, why worry? If the problem cannot be solved, worrying will do you no good.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 6" },
        { id: 6, text: "May I be a guard for those who are protectorless, a guide for those who journey on the road. For those who wish to cross the water, may I be a boat, a raft, a bridge.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 3" },
        { id: 7, text: "May I be an island for those who seek one, and a lamp for those desiring light. May I be a bed for all who wish to rest, and a servant for all who want a servant.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 3" },
        { id: 8, text: "Those desiring speedily to be a refuge for themselves and others should practice the supreme secret: the exchange of self for others.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 8" },
        { id: 9, text: "Patience is the supreme austerity. Patience is the highest virtue. So the Buddhas say.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 6" },
        { id: 10, text: "There is nothing that does not grow easier through habit. Putting up with little difficulties will prepare me to endure great hardships.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 6" },
        { id: 11, text: "Harmful beings are as limitless as space. They cannot possibly all be overcome. But if I overcome thoughts of anger alone, this will be equal to vanquishing all foes.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 5" },
        { id: 12, text: "An enemy whom you have forgiven will become your teacher of patience, compassion, and generosity.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 6" },
        { id: 13, text: "Since I and other beings both, in wanting happiness, are equal and alike, what is so special about me that I strive for my happiness alone?", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 8" },
        { id: 14, text: "Suffering also has its worth. Through sorrow, pride is driven out, and pity felt for those who wander in the world.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 6" },
        { id: 15, text: "All the peace and happiness of the whole globe, the happiness of societies, the happiness of family, the happiness of the individual — all depend on the practice of kindness and compassion.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 8" },
        { id: 16, text: "This body is not mine. I am not this body. This is not my self. There is nothing of mine here. So what can be feared?", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 5" },
        { id: 17, text: "Like a blind person finding a jewel in a heap of refuse, so this awakening mind has arisen within me by some miraculous chance.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 3" },
        { id: 18, text: "Today my life has borne fruit, having well obtained this human existence. Today I am born into the family of the Buddhas.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 3" },
        { id: 19, text: "Just like the earth and other elements, may I always be the ground of life for boundless beings.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 3" },
        { id: 20, text: "As long as space remains, as long as sentient beings remain, until then may I too remain to dispel the sufferings of the world.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 10" },
        { id: 21, text: "Beings are not enslaved by anyone but their own mind, and by the mind alone they are set free.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 5" },
        { id: 22, text: "If with a kindly generosity one merely has the wish to soothe the aching heads of other beings, such a person has boundless merit.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 1" },
        { id: 23, text: "The hostile multitudes are vast as space — what chance is there that all should be subdued? Let but this angry mind be overthrown, and every foe is then and there destroyed.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 5" },
        { id: 24, text: "Those who wish to guard their practice should very attentively guard their minds. Those who do not guard their minds will be unable to guard their practice.", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 5" },
        { id: 25, text: "The practice of virtue is exceedingly rare, and whatever can counter it is great and powerful. If there is no force of patience to overcome it, what other wholesome virtue could there be?", author: "Shantideva", source: "Bodhicary\u0101vat\u0101ra, Chapter 6" },

        // === NAGARJUNA — Various Texts ===
        { id: 26, text: "Like a dream, like an illusion, like a city of Gandharvas — so have arising, abiding, and ceasing been taught.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 7" },
        { id: 27, text: "The essence of all things is emptiness. On account of what and to whom would anger arise?", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101" },
        { id: 28, text: "Whatever is dependently arisen, that is explained to be emptiness. That, being a dependent designation, is itself the middle way.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 24" },
        { id: 29, text: "There is nothing whatsoever of samsara that distinguishes it from nirvana. There is nothing whatsoever of nirvana that distinguishes it from samsara.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 25" },
        { id: 30, text: "The victorious ones have said that emptiness is the relinquishing of all views. For whomever emptiness is a view, that one has accomplished nothing.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 13" },
        { id: 31, text: "Without depending on convention, the ultimate truth cannot be taught. Without understanding the ultimate truth, nirvana is not achieved.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 24" },
        { id: 32, text: "Just as a magician creates an illusion by magic, and that illusion creates yet another illusion, so too is every action like an illusion within an illusion.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 17" },
        { id: 33, text: "If everything were not empty, there would be no arising and no perishing. It would follow for you that the Four Noble Truths do not exist.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 24" },
        { id: 34, text: "Whoever sees dependent arising also sees suffering, its origin, its cessation, and the path.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 24" },
        { id: 35, text: "Having there been no self-nature in causes and conditions, or in collections, or in individual things — they are therefore empty.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 1" },
        { id: 36, text: "Practice generosity without regard to self. This is the cause of achieving Buddhahood. How is there anything that cannot be given by one for whom the self does not exist?", author: "N\u0101g\u0101rjuna", source: "Precious Garland, Verse 175" },
        { id: 37, text: "Just as a plantain tree is nothing when its layers are peeled away, so too is the self, when sought through analysis, found to be utterly non-existent.", author: "N\u0101g\u0101rjuna", source: "Precious Garland" },
        { id: 38, text: "Having realized that this body is as fragile as a clay pot, having established this mind like a fortress, attack the afflictions with the weapon of wisdom.", author: "N\u0101g\u0101rjuna", source: "Letter to a Friend" },
        { id: 39, text: "The supreme wealth is contentment. The supreme friend is trust. The supreme food is awareness. The supreme bliss is nirvana.", author: "N\u0101g\u0101rjuna", source: "Letter to a Friend" },
        { id: 40, text: "Those who are slaves to their desires find no more satisfaction than a dog gnawing on a bare bone.", author: "N\u0101g\u0101rjuna", source: "Letter to a Friend" },
        { id: 41, text: "A mind that dwells on nothing is a mind at peace. The practice of dwelling on nothing is the practice of all practices.", author: "N\u0101g\u0101rjuna", source: "Seventy Stanzas on Emptiness" },
        { id: 42, text: "Things derive their being and nature by mutual dependence and are nothing in themselves.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101" },
        { id: 43, text: "What ceases to exist when emptiness is established? What comes to exist when emptiness is refuted? By refuting emptiness, one refutes all worldly conventions.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 24" },
        { id: 44, text: "Do not commit any unwholesome action, perform only wholesome ones, and tame your mind — this is the teaching of the Buddha.", author: "N\u0101g\u0101rjuna", source: "Letter to a Friend" },
        { id: 45, text: "One who has insight into the way things truly are sees neither permanence nor impermanence, neither self nor non-self, neither happiness nor suffering.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101" },
        { id: 46, text: "Unborn and unceasing, like nirvana — such is the nature of all things.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 18" },
        { id: 47, text: "Since there is no dharma that is not dependently arisen, there is no dharma that is not empty.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 24" },
        { id: 48, text: "When clinging to self is present, there is discrimination of other. On the basis of self and other, there arise clinging and aversion. From these alone arise all faults.", author: "N\u0101g\u0101rjuna", source: "Precious Garland, Verse 35" },
        { id: 49, text: "The ignorant work for their own benefit. The Buddha works for the benefit of others. Just look at the difference between them.", author: "N\u0101g\u0101rjuna", source: "Precious Garland" },
        { id: 50, text: "Through the elimination of karma and afflictions, there is liberation. Karma and afflictions come from conceptual thought. These come from mental fabrication. Fabrication ceases through emptiness.", author: "N\u0101g\u0101rjuna", source: "M\u016Blamadhyamakak\u0101rik\u0101, Chapter 18" }
    ];

    function getDayOfYear() {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    function getDailyQuote() {
        var dayIndex = getDayOfYear() % QUOTES.length;
        return QUOTES[dayIndex];
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function shareOnTwitter(quote) {
        var text = encodeURIComponent('\u201C' + quote.text + '\u201D \u2014 ' + quote.author);
        var url = encodeURIComponent(window.location.origin + window.location.pathname);
        window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + url, '_blank', 'noopener');
    }

    function shareOnFacebook() {
        var url = encodeURIComponent(window.location.origin + window.location.pathname);
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'noopener');
    }

    function copyToClipboard(quote) {
        var text = '\u201C' + quote.text + '\u201D \u2014 ' + quote.author;
        if (quote.source) text += ' (' + quote.source + ')';
        navigator.clipboard.writeText(text).then(function() {
            var btn = document.querySelector('.dharma-quote__copy-btn');
            if (btn) {
                var original = btn.innerHTML;
                btn.innerHTML = '&#10003;';
                btn.style.color = 'var(--gold)';
                setTimeout(function() {
                    btn.innerHTML = original;
                    btn.style.color = '';
                }, 2000);
            }
        });
    }

    function renderQuoteWidget() {
        var container = document.getElementById('dharmaQuoteWidget');
        if (!container) return;

        var quote = getDailyQuote();

        container.innerHTML =
            '<div class="dharma-quote__card reveal">' +
                '<div class="dharma-quote__icon">&#9784;</div>' +
                '<p class="dharma-quote__text">' + escapeHtml(quote.text) + '</p>' +
                '<p class="dharma-quote__author">&mdash; ' + escapeHtml(quote.author) + '</p>' +
                (quote.source ? '<p class="dharma-quote__source">' + escapeHtml(quote.source) + '</p>' : '') +
                '<div class="dharma-quote__share">' +
                    '<span class="dharma-quote__share-label" data-i18n="quote.share_label">Share this wisdom</span>' +
                    '<div class="dharma-quote__share-btns">' +
                        '<button class="dharma-quote__share-btn dharma-quote__twitter-btn" aria-label="Share on X" title="Share on X" onclick="window._dharmaQuoteShare(\'twitter\')">' +
                            '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
                        '</button>' +
                        '<button class="dharma-quote__share-btn dharma-quote__fb-btn" aria-label="Share on Facebook" title="Share on Facebook" onclick="window._dharmaQuoteShare(\'facebook\')">' +
                            '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' +
                        '</button>' +
                        '<button class="dharma-quote__share-btn dharma-quote__copy-btn" aria-label="Copy to clipboard" title="Copy quote" onclick="window._dharmaQuoteShare(\'copy\')">&#128203;</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        // Re-observe for scroll reveal
        var revealEls = container.querySelectorAll('.reveal');
        if (window._quoteObserver) {
            revealEls.forEach(function(el) { window._quoteObserver.observe(el); });
        }
    }

    // Expose share function globally
    window._dharmaQuoteShare = function(platform) {
        var quote = getDailyQuote();
        if (platform === 'twitter') shareOnTwitter(quote);
        else if (platform === 'facebook') shareOnFacebook();
        else if (platform === 'copy') copyToClipboard(quote);
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderQuoteWidget);
    } else {
        renderQuoteWidget();
    }
})();
