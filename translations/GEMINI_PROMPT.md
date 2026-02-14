# Translation Prompt for Gemini

## Instructions

I need you to translate a JSON file containing English content for a Tibetan Buddhist monastery website (Gaden Shartse Gungru Khangtsen Monastery) into 6 languages. The output should be a single JSON file containing all 7 languages (including the original English).

## Target Languages

1. **en** — English (keep as-is from the source)
2. **bo** — Tibetan (བོད་སྐད་) — Use formal/respectful Tibetan script (Uchen). This is the most important translation as it is the monks' native language.
3. **hi** — Hindi (हिन्दी) — Use Devanagari script. Formal/respectful tone.
4. **zh** — Chinese Simplified (中文) — Use simplified Chinese characters. Formal tone suitable for a Buddhist context.
5. **kn** — Kannada (ಕನ್ನಡ) — Use Kannada script. The monastery is located in Karnataka, India, so this is a key local language.
6. **fr** — French (Français) — Formal tone.
7. **es** — Spanish (Español) — Formal tone.

## Translation Guidelines

1. **DO NOT translate** proper nouns and names. Keep these in their original form:
   - "Gaden Shartse", "Gungru Khangtsen", "Mundgod", "Karnataka"
   - "Tsongkhapa", "Dalai Lama"
   - Buddhist terms that are commonly used as-is: "Puja", "Dharma", "Mandala", "Mahayana", "Gelug", "Tantra"
   - Sanskrit/Pali terms: "Pramana", "Prajnaparamita", "Madhyamaka", "Abhidharma", "Vinaya", "chak-pur"
   - Brand names: "AlpacApps", "Claude", "Google Pay", "PhonePe", "Paytm", "PayPal", "Razorpay", "Bitcoin", "Ethereum"
   - Payment terms: "UPI", "SWIFT", "IFSC"
   - Country names should be translated to their local equivalents in each language

2. **Preserve JSON structure exactly** — same keys, same nesting. Only translate the string values.

3. **Keep placeholder tokens** like `{amount}`, `{currency}`, `{frequency}`, `{name}` exactly as they are in the translated strings.

4. **Tone**: Respectful, warm, and spiritual — appropriate for a Buddhist monastery website. Avoid overly casual language.

5. **For Tibetan (bo)**: Use honorific forms where appropriate, especially when referring to monks, teachings, and spiritual practices. This audience is native Tibetan speakers familiar with Buddhist terminology.

6. **For all languages**: Keep translations natural and fluent, not word-for-word. Adapt idioms and expressions to feel native in each language.

7. **80G certificate** is an Indian tax deduction certificate — translate the concept appropriately for each language but keep "80G" as is since it's a specific Indian tax code.

## Output Format

Return a single JSON file structured as:

```json
{
  "en": { ... entire English content ... },
  "bo": { ... entire Tibetan translation ... },
  "hi": { ... entire Hindi translation ... },
  "zh": { ... entire Chinese translation ... },
  "kn": { ... entire Kannada translation ... },
  "fr": { ... entire French translation ... },
  "es": { ... entire Spanish translation ... }
}
```

## Source Content (English)

Paste the contents of `en.json` below this line, then send to Gemini:

---

```json
{paste the contents of translations/en.json here}
```
