// ========================================
// Sacred Sands — Teachings Content
// Buddhist teachings from the Gelug tradition
// ========================================

const Teachings = (function() {
    'use strict';

    // Buddha Family details for unlock events
    const BUDDHA_FAMILIES = {
        white: {
            name: 'Vairochana',
            title: 'The Illuminator',
            color: 'White',
            direction: 'Center',
            element: 'Space',
            poison: 'Ignorance',
            wisdom: 'Dharmadhatu Wisdom',
            wisdomDesc: 'The wisdom of the expanse of reality',
            icon: '\u26AA',
            description: 'Vairochana sits at the center of the mandala, representing the all-pervading nature of enlightenment. White symbolizes the purity of space itself \u2014 the ground from which all experience arises. This Buddha transforms ignorance into the wisdom that sees the true nature of all phenomena.'
        },
        blue: {
            name: 'Akshobhya',
            title: 'The Immovable',
            color: 'Blue',
            direction: 'East',
            element: 'Water',
            poison: 'Anger',
            wisdom: 'Mirror-like Wisdom',
            wisdomDesc: 'Reflecting all phenomena clearly without distortion',
            icon: '\uD83D\uDD35',
            description: 'Akshobhya, the Immovable One, guards the Eastern gate. The blue of deep water represents a mind that reflects reality perfectly, without the distortion of anger. When anger is purified, we see each situation with the clarity of a flawless mirror.'
        },
        yellow: {
            name: 'Ratnasambhava',
            title: 'The Jewel-Born',
            color: 'Yellow',
            direction: 'South',
            element: 'Earth',
            poison: 'Pride',
            wisdom: 'Equalizing Wisdom',
            wisdomDesc: 'Seeing the fundamental equality and preciousness of all beings',
            icon: '\uD83D\uDFE1',
            description: 'Ratnasambhava, the Jewel-Born, presides over the Southern quadrant. Golden yellow represents the richness of the earth and the generosity of spirit. This Buddha transforms pride into the wisdom that sees the fundamental equality of all beings \u2014 none higher, none lower.'
        },
        red: {
            name: 'Amitabha',
            title: 'Infinite Light',
            color: 'Red',
            direction: 'West',
            element: 'Fire',
            poison: 'Attachment',
            wisdom: 'Discriminating Wisdom',
            wisdomDesc: 'Seeing each phenomenon in its uniqueness',
            icon: '\uD83D\uDD34',
            description: 'Amitabha, the Buddha of Infinite Light, illuminates the Western gate. Red represents the warmth of fire and the passion of devotion. This Buddha transforms grasping attachment into discriminating wisdom \u2014 the ability to appreciate each thing for what it truly is, without clinging.'
        },
        green: {
            name: 'Amoghasiddhi',
            title: 'Unfailing Success',
            color: 'Green',
            direction: 'North',
            element: 'Wind',
            poison: 'Jealousy',
            wisdom: 'All-Accomplishing Wisdom',
            wisdomDesc: 'Fearless activity that accomplishes what needs to be done',
            icon: '\uD83D\uDFE2',
            description: 'Amoghasiddhi, the Almighty Conqueror, stands at the Northern gate. Green is the color of wind and vigorous action. This Buddha transforms jealousy and competitiveness into the wisdom of fearless, selfless action \u2014 accomplishing what benefits all beings without hesitation.'
        }
    };

    // Layer teachings (shown between mandala layers)
    const LAYER_TEACHINGS = {
        1: {
            icon: '\u2638',
            title: 'The Seed of Awakening',
            body: '<p>You begin at the center \u2014 the <strong>bindu</strong>, the point of origin. In Buddhist philosophy, this represents the seed of enlightenment that exists within every being.</p><p>The monks of Gaden Shartse always begin here, at the very heart of the mandala. Just as a lotus grows from muddy water to bloom in open air, the journey to awakening begins from exactly where you are.</p><p><em>"In the beginner\'s mind there are many possibilities, but in the expert\'s mind there are few."</em></p>'
        },
        2: {
            icon: '\uD83C\uDFDB',
            title: 'The Celestial Palace',
            body: '<p>You are now building the <strong>celestial palace</strong> \u2014 the divine dwelling place at the heart of the mandala. Its four walls face the four directions, each painted with the color of its presiding Buddha.</p><p>This palace represents the <strong>Four Noble Truths</strong> \u2014 the foundation of all Buddhist teaching:</p><p>1. <strong>Suffering exists</strong> \u2014 life contains dissatisfaction<br>2. <strong>Suffering has a cause</strong> \u2014 craving and ignorance<br>3. <strong>Suffering can end</strong> \u2014 liberation is possible<br>4. <strong>There is a path</strong> \u2014 the Eightfold Path leads to freedom</p><p>The palace is not an escape from these truths but a dwelling within them \u2014 a mind that has transformed suffering into wisdom.</p>'
        },
        3: {
            icon: '\uD83D\uDEAA',
            title: 'The Four Gates',
            body: '<p>The mandala\'s four T-shaped gates open in each cardinal direction. They are not barriers but invitations \u2014 welcoming all beings into the sacred space.</p><p>Each gate embodies one of the <strong>Four Boundless Thoughts</strong>:</p><p><strong>East:</strong> Loving-kindness \u2014 <em>"May all beings have happiness and its causes"</em><br><strong>South:</strong> Compassion \u2014 <em>"May all beings be free from suffering and its causes"</em><br><strong>West:</strong> Sympathetic Joy \u2014 <em>"May all beings never be separated from happiness"</em><br><strong>North:</strong> Equanimity \u2014 <em>"May all beings abide in peace, free from bias"</em></p><p>In the Gelug tradition, these four qualities are cultivated daily through meditation. The monks of Gungru Khangtsen recite these aspirations each morning before dawn.</p>'
        },
        4: {
            icon: '\uD83C\uDF38',
            title: 'The Protective Rings',
            body: '<p>The outer rings of the mandala form layers of protection and transformation. Moving inward, a practitioner passes through:</p><p><strong>The Ring of Fire</strong> \u2014 The purifying flames of wisdom, burning away ignorance and revealing the truth beneath appearances.</p><p><strong>The Vajra Ring</strong> \u2014 The indestructible diamond of reality. <em>Vajra</em> means both "thunderbolt" and "diamond" \u2014 power and purity combined.</p><p><strong>The Lotus Ring</strong> \u2014 Like the lotus that grows from mud yet remains unstained, this ring symbolizes the journey from confusion to clarity, from samsara to nirvana.</p><p>These are not walls keeping you out, but stages of transformation as you journey inward toward your own awakened nature.</p>'
        },
        5: {
            icon: '\uD83D\uDD25',
            title: 'Impermanence',
            body: '<p>The mandala is almost complete. Every grain has been placed with intention and care. It is a thing of profound beauty.</p><p>And soon, it will be swept away.</p><p>This is the deepest teaching of the sand mandala: <strong>impermanence</strong>. The monks spend days or weeks in devoted creation, knowing from the very first grain that the mandala will be destroyed.</p><p>Why create something beautiful if it will not last? Because <em>nothing</em> lasts. The mandala teaches us to pour our full devotion into this moment, to create with all our heart, and then to release with grace.</p><p><em>"All conditioned things are impermanent. Work out your own salvation with diligence."</em> \u2014 The Buddha\'s final words</p><p>At Gaden Shartse, the monks say the dissolution is not a destruction but a <strong>completion</strong> \u2014 the mandala\'s purpose is fulfilled when its blessings are released into the world.</p>'
        }
    };

    // Random tips/teachings shown during gameplay
    const GAMEPLAY_TIPS = [
        {
            title: 'The Chak-pur',
            text: 'The monks use a metal funnel called a chak-pur to place the sand. By rubbing a rod across its ridged surface, they create a gentle vibration that lets sand trickle out with incredible precision.'
        },
        {
            title: 'Working in Quadrants',
            text: 'Each monk works within their own quadrant of the mandala. They must wait until an entire layer is complete before moving outward together, ensuring balance and harmony.'
        },
        {
            title: 'Silence and Mantra',
            text: 'The monks work either in complete silence or while softly chanting mantras. Every moment of creation is an act of meditation \u2014 the focus is not on the result, but on the quality of attention given to each grain.'
        },
        {
            title: 'The Colored Sands',
            text: 'Historically, sand mandala colors came from powdered precious stones \u2014 lapis lazuli for blue, ruby for red, gold for yellow. Today, the monks use marble dust colored with vegetable dyes.'
        },
        {
            title: 'Center to Edge',
            text: 'A mandala is always built from the center outward, just as enlightenment radiates from the awakened heart to encompass all of reality.'
        },
        {
            title: 'Days of Creation',
            text: 'A typical sand mandala takes 5 to 20 days to complete. The most complex, the Kalachakra mandala with its 722 deities, can take several weeks.'
        },
        {
            title: 'The Gelug Tradition',
            text: 'Gungru Khangtsen belongs to the Gelug school, founded by Je Tsongkhapa in the early 15th century. The Gelug tradition emphasizes rigorous scholarship, monastic discipline, and a graduated path to enlightenment.'
        },
        {
            title: 'What is a Khangtsen?',
            text: 'A Khangtsen is a regional house within a monastic college. Monks are assigned based on their place of origin, creating a supportive community of fellow practitioners who share language and culture.'
        },
        {
            title: 'Gaden Shartse Monastery',
            text: 'Gaden Monastery was founded by Tsongkhapa himself in 1409 and is the mother monastery of the Gelug tradition. Shartse is one of its two colleges, and Gungru is one of its Khangtsens.'
        },
        {
            title: 'Merit and Dedication',
            text: 'Buddhists believe that positive actions generate "merit" \u2014 beneficial energy that can be dedicated to the welfare of all beings. Every grain of sand placed with good intention generates merit.'
        },
        {
            title: 'The Mandala Offering',
            text: 'In Tibetan Buddhist practice, practitioners symbolically offer the entire universe to the Buddhas through a mandala offering. This practice cultivates generosity and lets go of attachment.'
        },
        {
            title: 'Bodhicitta',
            text: 'Before beginning any practice, monks generate bodhicitta \u2014 the aspiration to attain enlightenment not for oneself alone, but for the benefit of all sentient beings. This intention transforms every action into a step on the path.'
        }
    ];

    // Dissolution teachings
    const DISSOLUTION_TEACHING = {
        title: 'The Dissolution Ceremony',
        body: '<p>The mandala is complete, but its greatest teaching is yet to come.</p><p>The lead monk draws a line vertically through the center, then horizontally. The other monks then sweep the sand inward from the edges, accompanied by chanting and the sound of bells.</p><p>The multicolored mandala becomes a small pile of gray sand. This sand is then carried to a flowing river and poured into the water, carrying the mandala\'s blessings outward to the world.</p><p>Some sand is placed in small bags and given to those present as a blessing \u2014 a reminder that all beautiful things arise, flourish, and pass away.</p>'
    };

    // Get a random gameplay tip
    function getRandomTip() {
        return GAMEPLAY_TIPS[Math.floor(Math.random() * GAMEPLAY_TIPS.length)];
    }

    // Get layer teaching
    function getLayerTeaching(layer) {
        return LAYER_TEACHINGS[layer] || null;
    }

    // Get Buddha family info
    function getBuddhaFamily(color) {
        return BUDDHA_FAMILIES[color] || null;
    }

    return {
        BUDDHA_FAMILIES,
        LAYER_TEACHINGS,
        GAMEPLAY_TIPS,
        DISSOLUTION_TEACHING,
        getRandomTip,
        getLayerTeaching,
        getBuddhaFamily
    };

})();
