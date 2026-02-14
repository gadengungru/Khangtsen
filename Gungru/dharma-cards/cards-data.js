// ========================================
// Dharma Guardians — Card Data
// Buddhist Trading Card Game content
// Rooted in the Gelug tradition of
// Gaden Shartse Gungru Khangtsen
// ========================================

const DharmaCards = (function() {
    'use strict';

    // Card categories
    const CATEGORIES = {
        buddha:   { name: 'Buddha & Bodhisattva', icon: '\u2638', color: '#D4A843' },
        teaching: { name: 'Teaching',             icon: '\uD83D\uDCDC', color: '#7B1A2C' },
        art:      { name: 'Sacred Art',           icon: '\uD83C\uDFA8', color: '#2B5C8A' },
        place:    { name: 'Place & History',       icon: '\uD83C\uDFDB', color: '#2D6A4F' },
        monastic: { name: 'Monastic Life',        icon: '\uD83D\uDE4F', color: '#E8941A' }
    };

    // All cards in the game
    const CARDS = [
        // ── Buddha & Bodhisattva Cards ──
        {
            id: 'vairochana',
            name: 'Vairochana',
            subtitle: 'The Illuminator',
            category: 'buddha',
            rarity: 'legendary',
            emoji: '\u2638',
            wisdom: 10,
            compassion: 8,
            merit: 9,
            shortDesc: 'Center of the mandala. Transforms ignorance into the wisdom of reality.',
            teaching: 'Vairochana sits at the center of every mandala, representing the all-pervading nature of enlightenment. White symbolizes the purity of space itself \u2014 the boundless ground from which all experience arises. In the Gelug tradition, Vairochana embodies Dharmadhatu Wisdom: the direct recognition that all phenomena share the same ultimate nature. When ignorance is purified, we see reality as it truly is \u2014 luminous, open, and interconnected.',
            quote: 'The nature of mind is clear light. Defilements are adventitious.',
            related: ['akshobhya', 'four-noble-truths', 'sand-mandala']
        },
        {
            id: 'akshobhya',
            name: 'Akshobhya',
            subtitle: 'The Immovable',
            category: 'buddha',
            rarity: 'rare',
            emoji: '\uD83D\uDD35',
            wisdom: 9,
            compassion: 7,
            merit: 8,
            shortDesc: 'Guardian of the East. Transforms anger into mirror-like clarity.',
            teaching: 'Akshobhya, the Immovable One, guards the Eastern gate of the mandala. The deep blue of water represents a mind that reflects reality perfectly, without the turbulence of anger or aversion. In the Gelug monastic tradition, monks train for decades through rigorous debate to develop precisely this quality \u2014 the ability to examine any proposition with unwavering clarity. When anger is purified through practice, what remains is Mirror-like Wisdom: the capacity to see each situation exactly as it is.',
            quote: 'Like still water reflecting the moon, the purified mind reflects all things without distortion.',
            related: ['vairochana', 'debate', 'five-treatises']
        },
        {
            id: 'chenrezig',
            name: 'Chenrezig',
            subtitle: 'Avalokiteshvara',
            category: 'buddha',
            rarity: 'legendary',
            emoji: '\uD83D\uDD4A',
            wisdom: 8,
            compassion: 10,
            merit: 10,
            shortDesc: 'Bodhisattva of compassion. HHDL is considered his emanation.',
            teaching: 'Chenrezig (Avalokiteshvara) is the bodhisattva of universal compassion, depicted with four arms representing loving-kindness, compassion, sympathetic joy, and equanimity \u2014 the Four Boundless Thoughts. In the Gelug tradition, His Holiness the Dalai Lama is revered as the living emanation of Chenrezig. The monks of Gaden Shartse chant the six-syllable mantra OM MANI PADME HUM daily, invoking this boundless compassion for all sentient beings. The sand mandalas created on USA tours often feature Chenrezig as the central deity.',
            quote: 'OM MANI PADME HUM \u2014 The jewel is in the lotus.',
            related: ['dalai-lama', 'four-boundless', 'usa-tours']
        },
        {
            id: 'manjushri',
            name: 'Manjushri',
            subtitle: 'Gentle Glory',
            category: 'buddha',
            rarity: 'rare',
            emoji: '\u2694',
            wisdom: 10,
            compassion: 7,
            merit: 8,
            shortDesc: 'Bodhisattva of wisdom. Wields the sword that cuts through ignorance.',
            teaching: 'Manjushri, the Bodhisattva of Wisdom, holds a flaming sword in one hand and the Prajnaparamita sutra in the other. The sword cuts through the root of ignorance; the scripture represents the perfection of wisdom. Je Tsongkhapa, founder of the Gelug tradition and Gaden Monastery, is said to have had direct visions of Manjushri, who guided his philosophical masterworks. Every Gelug monk studies the Five Great Treatises \u2014 a curriculum designed to develop the very wisdom Manjushri embodies.',
            quote: 'Wisdom is the sharp sword that severs the root of suffering.',
            related: ['tsongkhapa', 'five-treatises', 'puja-ceremony']
        },
        {
            id: 'tara',
            name: 'Green Tara',
            subtitle: 'The Swift Liberator',
            category: 'buddha',
            rarity: 'rare',
            emoji: '\uD83D\uDFE2',
            wisdom: 8,
            compassion: 9,
            merit: 9,
            shortDesc: 'Mother of liberation. Swift protector from obstacles and fear.',
            teaching: 'Green Tara is the mother of all Buddhas, born from the tears of Chenrezig as he wept for the suffering of beings. She sits with one foot extended, ready to spring into action at a moment\'s notice. In the Gelug monasteries of Karnataka, Tara pujas are among the most frequently requested ceremonies \u2014 performed for protection, the removal of obstacles, and the swift accomplishment of virtuous aims. The monks chant the 21 Praises to Tara, each verse invoking a different aspect of her liberating activity.',
            quote: 'She who saves \u2014 born from the compassionate tears of the Bodhisattva.',
            related: ['chenrezig', 'puja-ceremony', 'mundgod']
        },

        // ── Teaching Cards ──
        {
            id: 'four-noble-truths',
            name: 'Four Noble Truths',
            subtitle: 'Foundation of the Path',
            category: 'teaching',
            rarity: 'legendary',
            emoji: '\u2638',
            wisdom: 10,
            compassion: 7,
            merit: 8,
            shortDesc: 'The Buddha\'s first teaching. The foundation of all Buddhist practice.',
            teaching: 'The Four Noble Truths are the very first teaching the Buddha gave after his enlightenment at Bodh Gaya. They form the bedrock of all Buddhist philosophy studied at Gaden Shartse: (1) Suffering exists \u2014 life inevitably involves dissatisfaction, (2) Suffering has a cause \u2014 craving and ignorance, (3) Suffering can end \u2014 liberation is possible, (4) There is a path \u2014 the Noble Eightfold Path. In the Gelug monastic curriculum, these truths are not merely memorized but debated and internalized over years of study.',
            quote: 'This is suffering. This is the origin. This is the cessation. This is the path.',
            related: ['eightfold-path', 'five-treatises', 'vairochana']
        },
        {
            id: 'eightfold-path',
            name: 'Noble Eightfold Path',
            subtitle: 'The Middle Way',
            category: 'teaching',
            rarity: 'uncommon',
            emoji: '\u2638',
            wisdom: 9,
            compassion: 8,
            merit: 7,
            shortDesc: 'Eight practices leading from suffering to awakening.',
            teaching: 'The Noble Eightfold Path is the practical road map to liberation: Right View, Right Intention, Right Speech, Right Action, Right Livelihood, Right Effort, Right Mindfulness, and Right Concentration. These eight are grouped into three trainings \u2014 wisdom (prajna), ethics (shila), and meditation (samadhi) \u2014 which mirror the three pillars of Gelug monastic life. At Gaden Shartse in Karnataka, every day is structured around these trainings: study and debate (wisdom), monastic discipline (ethics), and prayer sessions (meditation).',
            quote: 'Neither indulgence nor asceticism, but the Middle Way.',
            related: ['four-noble-truths', 'vinaya', 'daily-routine']
        },
        {
            id: 'impermanence',
            name: 'Impermanence',
            subtitle: 'Anicca',
            category: 'teaching',
            rarity: 'uncommon',
            emoji: '\uD83C\uDF43',
            wisdom: 8,
            compassion: 6,
            merit: 7,
            shortDesc: 'All conditioned things arise and pass away. Nothing is permanent.',
            teaching: 'Impermanence (anicca) is not merely a philosophical concept \u2014 it is a lived practice embodied most powerfully in the sand mandala tradition. After days or weeks of painstaking creation, the mandala is ceremonially swept away and its sands released into flowing water. This is not destruction but completion: the teaching that all phenomena, no matter how beautiful, are transient. The monks of Gungru Khangtsen carry this understanding into every aspect of their lives in Karnataka, from the changing monsoon seasons to the turning of the academic year.',
            quote: 'All conditioned things are impermanent. Work out your own salvation with diligence.',
            related: ['sand-mandala', 'dissolution', 'four-noble-truths']
        },
        {
            id: 'four-boundless',
            name: 'Four Boundless Thoughts',
            subtitle: 'Brahmaviharas',
            category: 'teaching',
            rarity: 'uncommon',
            emoji: '\u2764',
            wisdom: 7,
            compassion: 10,
            merit: 9,
            shortDesc: 'Loving-kindness, compassion, joy, and equanimity without limit.',
            teaching: 'The Four Boundless Thoughts are the cornerstones of Mahayana Buddhist meditation: Loving-kindness (may all beings have happiness), Compassion (may all be free from suffering), Sympathetic Joy (may all never be separated from happiness), and Equanimity (may all abide in peace, free from bias). These four correspond to the four gates of the mandala \u2014 East, South, West, and North. At Gaden Shartse, every major puja begins with the monks generating these four attitudes, expanding them outward from loved ones to all sentient beings without exception.',
            quote: 'May all sentient beings have happiness and its causes.',
            related: ['chenrezig', 'puja-ceremony', 'sand-mandala']
        },
        {
            id: 'five-treatises',
            name: 'Five Great Treatises',
            subtitle: 'The Gelug Curriculum',
            category: 'teaching',
            rarity: 'rare',
            emoji: '\uD83D\uDCDA',
            wisdom: 10,
            compassion: 5,
            merit: 8,
            shortDesc: 'The 15-20 year monastic study program. Pramana, Prajnaparamita, Madhyamaka, Abhidharma, Vinaya.',
            teaching: 'The Five Great Treatises form the core of the Gelug monastic curriculum \u2014 a 15 to 20 year intensive study program that is one of the most rigorous intellectual training systems in the world. Pramana (logic and epistemology) teaches precise reasoning. Prajnaparamita (perfection of wisdom) explores emptiness. Madhyamaka (the middle way) navigates between eternalism and nihilism. Abhidharma maps the nature of mind and phenomena. Vinaya establishes monastic discipline. At Gaden Shartse in Mundgod, Karnataka, monks master these through daily debate sessions, where understanding is tested in real time.',
            quote: 'Study without debate is like a lamp without oil.',
            related: ['debate', 'tsongkhapa', 'geshe-degree']
        },

        // ── Sacred Art Cards ──
        {
            id: 'sand-mandala',
            name: 'Sand Mandala',
            subtitle: 'Sacred Geometry',
            category: 'art',
            rarity: 'legendary',
            emoji: '\uD83D\uDD4C',
            wisdom: 8,
            compassion: 8,
            merit: 10,
            shortDesc: 'Millions of sand grains forming a sacred palace. Created to be dissolved.',
            teaching: 'A sand mandala is an intricate sacred design created from millions of grains of colored sand, placed one at a time using traditional metal funnels called chak-pur. The mandala represents the celestial palace of a specific deity \u2014 a three-dimensional architectural blueprint rendered in two dimensions. Monks of Gungru Khangtsen spend years learning this art, and they share it with the world during their annual USA tours. Each mandala is a meditation in itself: the act of creation cultivates patience, precision, and mindful awareness.',
            quote: 'Each grain of sand is placed with the intention to benefit all beings.',
            related: ['impermanence', 'dissolution', 'usa-tours']
        },
        {
            id: 'butter-lamp',
            name: 'Butter Lamp Offering',
            subtitle: 'Light of Wisdom',
            category: 'art',
            rarity: 'common',
            emoji: '\uD83D\uDD6F',
            wisdom: 5,
            compassion: 7,
            merit: 8,
            shortDesc: 'Light dispelling the darkness of ignorance. One of the simplest offerings.',
            teaching: 'The butter lamp is one of the most ancient and meaningful offerings in Tibetan Buddhism. Its light symbolizes the wisdom that dispels the darkness of ignorance. At Gungru Khangtsen, hundreds of butter lamps are lit daily \u2014 in the prayer hall, before sacred images, and during puja ceremonies. Anyone can sponsor a butter lamp to be lit in their name or in memory of a loved one for a small offering. It is a simple act that connects the sponsor to the monks\' continuous prayer and meditation.',
            quote: 'A single lamp can light a thousand others without diminishing itself.',
            related: ['puja-ceremony', 'daily-routine', 'impermanence']
        },
        {
            id: 'debate',
            name: 'Monastic Debate',
            subtitle: 'The Gelug Hallmark',
            category: 'art',
            rarity: 'rare',
            emoji: '\uD83D\uDC4F',
            wisdom: 10,
            compassion: 5,
            merit: 7,
            shortDesc: 'The distinctive clap-and-challenge debate that sharpens wisdom like a sword.',
            teaching: 'Monastic debate is the distinctive hallmark of the Gelug tradition. Monks pair off in the debate courtyard \u2014 one standing, one seated \u2014 and challenge each other with sharp philosophical questions, punctuated by a dramatic hand clap that symbolizes the cutting away of wrong views. This is not arguing for its own sake: it is a rigorous method of testing understanding in real time. A monk cannot hide behind memorized answers; they must demonstrate genuine comprehension. At Gaden Shartse in Karnataka, debate sessions happen every afternoon and often continue deep into the night.',
            quote: 'The hand clap cuts through wrong views. The stamped foot grounds the truth.',
            related: ['five-treatises', 'geshe-degree', 'daily-routine']
        },
        {
            id: 'dissolution',
            name: 'Mandala Dissolution',
            subtitle: 'The Great Teaching',
            category: 'art',
            rarity: 'rare',
            emoji: '\uD83C\uDF0A',
            wisdom: 10,
            compassion: 8,
            merit: 9,
            shortDesc: 'The ceremonial sweeping away. Days of creation released in a single act.',
            teaching: 'The dissolution ceremony is the climax of every sand mandala creation. After days of painstaking work, the monks chant prayers, then draw lines through the mandala with a ceremonial brush. The intricate design is swept inward to the center, mixed together, and distributed to attendees as blessed sand. A portion is carried to the nearest body of water and released, spreading the blessings to all beings. This is not destruction \u2014 it is the mandala\'s ultimate teaching: that attachment to even the most beautiful things causes suffering. Letting go is itself enlightenment.',
            quote: 'In the letting go, the mandala gives its greatest gift.',
            related: ['sand-mandala', 'impermanence', 'usa-tours']
        },

        // ── Place & History Cards ──
        {
            id: 'mundgod',
            name: 'Mundgod, Karnataka',
            subtitle: 'Home in Exile',
            category: 'place',
            rarity: 'legendary',
            emoji: '\uD83C\uDFD8',
            wisdom: 6,
            compassion: 9,
            merit: 10,
            shortDesc: 'The Tibetan settlement in South India where the tradition lives on.',
            teaching: 'Mundgod, in the North Kanara district of Karnataka, India, is home to one of the largest Tibetan refugee settlements in the world. After the Chinese invasion of Tibet in 1959 and the exile of His Holiness the Dalai Lama, the Indian government generously offered land in Karnataka for the displaced monastic communities. What began as a refugee camp in the tropical forests of South India has become a thriving center of Tibetan Buddhist learning. Today, Mundgod hosts several major monasteries including Gaden Shartse and Gaden Jangtse, with thousands of monks preserving a tradition that nearly vanished.',
            quote: 'From the snows of Tibet to the monsoons of Karnataka, the Dharma endures.',
            related: ['gaden-monastery', 'dalai-lama', 'tibet']
        },
        {
            id: 'gaden-monastery',
            name: 'Gaden Monastery',
            subtitle: 'Est. 1409',
            category: 'place',
            rarity: 'rare',
            emoji: '\uD83C\uDFDB',
            wisdom: 8,
            compassion: 7,
            merit: 9,
            shortDesc: 'The principal monastery of the Gelug tradition, founded by Je Tsongkhapa.',
            teaching: 'Gaden Monastery was founded by Je Tsongkhapa himself in 1409, making it the principal seat of the Gelug tradition. The original Gaden sat atop a mountain near Lhasa, Tibet. After 1959, it was re-established in Mundgod, Karnataka, where it continues to this day. Gaden is divided into two colleges \u2014 Shartse (Eastern Peak) and Jangtse (Northern Peak) \u2014 each maintaining its own lineage of teachings. Gungru Khangtsen is one of eleven regional houses within Gaden Shartse, organized by the monks\' geographic origins in Tibet.',
            quote: 'The seat of the Victorious One \u2014 where Tsongkhapa\'s vision lives.',
            related: ['tsongkhapa', 'mundgod', 'khangtsen']
        },
        {
            id: 'tibet',
            name: 'Tibet',
            subtitle: 'The Land of Snows',
            category: 'place',
            rarity: 'uncommon',
            emoji: '\uD83C\uDFD4',
            wisdom: 7,
            compassion: 8,
            merit: 7,
            shortDesc: 'The ancestral homeland. Where the tradition was born and from which it was exiled.',
            teaching: 'Tibet, the Land of Snows, is the homeland of the tradition that the monks of Gungru Khangtsen preserve. For centuries, Tibet was a civilization shaped entirely by Buddhism \u2014 its government, education, art, and daily life all centered around the Dharma. The Chinese invasion of 1959 shattered this world. Monasteries were destroyed, monks were dispersed, and His Holiness the Dalai Lama fled to India. But the tradition survived. In the settlements of Karnataka, the monks rebuilt what was lost, carrying forward the knowledge that was passed down through an unbroken lineage of teachers stretching back to the Buddha himself.',
            quote: 'The snow lion roars from new mountains.',
            related: ['mundgod', 'dalai-lama', 'gaden-monastery']
        },
        {
            id: 'tsongkhapa',
            name: 'Je Tsongkhapa',
            subtitle: 'Founder of Gelug',
            category: 'place',
            rarity: 'legendary',
            emoji: '\uD83D\uDC51',
            wisdom: 10,
            compassion: 9,
            merit: 10,
            shortDesc: 'The great reformer who founded Gaden Monastery and the Gelug tradition in 1409.',
            teaching: 'Je Tsongkhapa (1357\u20131419) was one of the most influential Buddhist teachers in history. A brilliant scholar who studied under masters from all Tibetan traditions, he founded the Gelug school emphasizing rigorous study, monastic discipline, and the gradual path to enlightenment. He established Gaden Monastery in 1409 and authored masterworks on philosophy that are still the core curriculum today. Tsongkhapa is said to have received direct guidance from Manjushri, the Bodhisattva of Wisdom. His legacy lives on in every debate session, every text studied, and every puja performed at Gaden Shartse in Karnataka.',
            quote: 'To the great opener of the path to freedom, I pay homage.',
            related: ['gaden-monastery', 'manjushri', 'five-treatises']
        },

        // ── Monastic Life Cards ──
        {
            id: 'daily-routine',
            name: 'Daily Monastic Life',
            subtitle: 'A Day at Gungru',
            category: 'monastic',
            rarity: 'common',
            emoji: '\u23F0',
            wisdom: 5,
            compassion: 6,
            merit: 7,
            shortDesc: 'From pre-dawn prayers to evening debate. The rhythm of monastic life.',
            teaching: 'A monk\'s day at Gungru Khangtsen begins before dawn with prayers and meditation. Morning tea is followed by memorization of philosophical texts. The late morning brings study sessions, where monks pore over the great treatises with their teachers. Afternoon brings the highlight: debate sessions in the open courtyard, where monks test each other\'s understanding with rapid-fire questions and dramatic gestures. Evening prayers close the day. This rhythm \u2014 prayer, study, debate \u2014 has continued unbroken for centuries, carried from Tibet to Karnataka.',
            quote: 'The bell sounds before dawn. The Dharma does not sleep.',
            related: ['debate', 'five-treatises', 'khangtsen']
        },
        {
            id: 'puja-ceremony',
            name: 'Puja Ceremony',
            subtitle: 'Sacred Prayer Ritual',
            category: 'monastic',
            rarity: 'common',
            emoji: '\uD83D\uDE4F',
            wisdom: 6,
            compassion: 9,
            merit: 9,
            shortDesc: 'Prayer ceremonies performed for healing, protection, and blessing.',
            teaching: 'A puja is a Buddhist prayer ceremony in which monks chant sacred texts, make offerings, and perform rituals directed toward specific intentions. At Gungru Khangtsen, pujas are performed daily and can be requested by anyone worldwide \u2014 for healing (Medicine Buddha Puja), protection (Tara Puja), wisdom (Manjushri Puja), spiritual growth (Lama Choepa), or for the deceased. When the entire assembly of sixty monks chants together in the prayer hall, the sound carries the collective intention and merit of centuries of unbroken practice.',
            quote: 'Sixty voices, one intention. Merit ripples outward without end.',
            related: ['butter-lamp', 'tara', 'manjushri']
        },
        {
            id: 'usa-tours',
            name: 'Sacred Arts Tour',
            subtitle: 'Sharing the Dharma',
            category: 'monastic',
            rarity: 'uncommon',
            emoji: '\u2708',
            wisdom: 6,
            compassion: 8,
            merit: 8,
            shortDesc: 'Annual tours bringing sand mandalas and teachings to the United States.',
            teaching: 'Each year, monks from Gaden Shartse Gungru Khangtsen travel to the United States on Sacred Arts Tours, creating sand mandalas at universities, museums, and cultural centers. These tours serve a dual purpose: they share the living traditions of Tibetan Buddhism with Western audiences, and they raise essential funds to support the monastery in Karnataka. Visitors watch in awe as monks spend days creating intricate mandalas grain by grain, then participate in the powerful dissolution ceremony that teaches impermanence.',
            quote: 'The monks carry the tradition across oceans, one grain of sand at a time.',
            related: ['sand-mandala', 'dissolution', 'mundgod']
        },
        {
            id: 'khangtsen',
            name: 'Khangtsen System',
            subtitle: 'Regional Houses',
            category: 'monastic',
            rarity: 'uncommon',
            emoji: '\uD83C\uDFE0',
            wisdom: 5,
            compassion: 8,
            merit: 7,
            shortDesc: 'Eleven regional houses within Gaden Shartse. Gungru is one.',
            teaching: 'A Khangtsen is a regional house within a larger Tibetan monastery, organizing monks by their geographic origin in Tibet. Gungru Khangtsen is one of eleven such houses within Gaden Shartse Monastery. Each Khangtsen provides its monks with housing, meals, and the intimate community support essential for the long years of monastic training. The Khangtsen system creates a family within the larger monastic institution \u2014 senior monks mentor younger ones, resources are shared, and the bonds formed last a lifetime. Today, roughly sixty monks call Gungru Khangtsen home.',
            quote: 'Within the great monastery, the Khangtsen is home.',
            related: ['gaden-monastery', 'mundgod', 'daily-routine']
        },
        {
            id: 'geshe-degree',
            name: 'Geshe Degree',
            subtitle: 'Doctor of Buddhist Philosophy',
            category: 'monastic',
            rarity: 'rare',
            emoji: '\uD83C\uDF93',
            wisdom: 10,
            compassion: 6,
            merit: 9,
            shortDesc: 'The highest academic degree. Earned after 15-20 years of study and debate.',
            teaching: 'The Geshe degree is the highest academic achievement in the Gelug monastic system, roughly equivalent to a doctorate in Buddhist philosophy. It requires 15 to 20 years of intensive study of the Five Great Treatises, culminating in a series of public examinations where the candidate must defend their understanding before the entire monastic assembly. The debates can last for hours and cover every aspect of Buddhist philosophy. Earning the Geshe degree is a testament to extraordinary intellectual discipline and spiritual dedication. Monks of Gungru Khangtsen pursue this path in the study halls and debate courtyards of Karnataka.',
            quote: 'Twenty years of study, distilled into a single debate.',
            related: ['five-treatises', 'debate', 'tsongkhapa']
        },
        {
            id: 'dalai-lama',
            name: 'His Holiness the Dalai Lama',
            subtitle: 'Ocean of Wisdom',
            category: 'monastic',
            rarity: 'legendary',
            emoji: '\uD83D\uDE4F',
            wisdom: 10,
            compassion: 10,
            merit: 10,
            shortDesc: 'The most well-known teacher of the Gelug lineage. Emanation of Chenrezig.',
            teaching: 'His Holiness the 14th Dalai Lama, Tenzin Gyatso, is the spiritual leader of Tibetan Buddhism and the most well-known teacher of the Gelug lineage. Revered as the living emanation of Chenrezig, the Bodhisattva of Compassion, he has dedicated his life to promoting non-violence, inter-religious dialogue, and the preservation of Tibetan culture. After the 1959 exile, it was under his guidance that the monastic communities were re-established in Karnataka and other settlements across India, ensuring that the tradition would survive for future generations.',
            quote: 'My religion is kindness.',
            related: ['chenrezig', 'tibet', 'mundgod']
        }
    ];

    // Public API
    return {
        CATEGORIES: CATEGORIES,
        CARDS: CARDS,

        getCardById: function(id) {
            return CARDS.find(function(c) { return c.id === id; });
        },

        getCardsByCategory: function(cat) {
            return CARDS.filter(function(c) { return c.category === cat; });
        },

        getRelatedCards: function(cardId) {
            var card = this.getCardById(cardId);
            if (!card) return [];
            return card.related.map(this.getCardById.bind(this)).filter(Boolean);
        },

        getTotalCards: function() {
            return CARDS.length;
        },

        getCategoryCount: function(cat) {
            return this.getCardsByCategory(cat).length;
        }
    };
})();
