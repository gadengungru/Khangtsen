#!/usr/bin/env python3
"""Convert nested camelCase locale files to Gungru flat snake_case format."""

import json
import os
import sys

LOCALES_DIR = os.path.join(os.path.dirname(__file__), '..', 'locales')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'Gungru', 'assets', 'lang')


def get(obj, *keys):
    """Safely traverse nested dict."""
    for k in keys:
        if not isinstance(obj, dict):
            return None
        obj = obj.get(k)
    return obj


def convert(src):
    """Convert a nested locale dict to Gungru flat format."""
    out = {}

    # --- nav ---
    out["nav"] = {
        "home": get(src, "nav", "home"),
        "general_understanding": get(src, "nav", "generalUnderstanding"),
        "donate": get(src, "nav", "donate"),
    }

    # --- home ---
    t1 = get(src, "home", "hero", "title1") or ""
    t2 = get(src, "home", "hero", "title2") or ""
    t3 = get(src, "home", "hero", "title3") or ""
    combined_title = f"{t1}<br><em>{t2}</em><br>{t3}"

    out["home"] = {
        "location": get(src, "home", "hero", "location"),
        "title": combined_title,
        "tagline": get(src, "home", "hero", "tagline"),
        "cta_donate": get(src, "home", "hero", "ctaDonate"),
        "cta_learn": get(src, "home", "hero", "ctaLearnMore"),
        "about_title": get(src, "home", "about", "title"),
        "about_text": get(src, "home", "about", "text"),
        "badge_est": get(src, "home", "about", "badges", "established"),
        "badge_monks": get(src, "home", "about", "badges", "monks"),
        "badge_tours": get(src, "home", "about", "badges", "tours"),
        "badge_mandala": get(src, "home", "about", "badges", "mandala"),
        "gallery_label": get(src, "home", "gallery", "label"),
        "gallery_title": get(src, "home", "gallery", "title"),
        "gallery_subtitle": get(src, "home", "gallery", "subtitle"),
        "gallery_monastery_title": get(src, "home", "gallery", "cards", "monastery", "title"),
        "gallery_monastery_desc": get(src, "home", "gallery", "cards", "monastery", "desc"),
        "gallery_ceremony_title": get(src, "home", "gallery", "cards", "ceremonies", "title"),
        "gallery_ceremony_desc": get(src, "home", "gallery", "cards", "ceremonies", "desc"),
        "gallery_mandala_title": get(src, "home", "gallery", "cards", "mandala", "title"),
        "gallery_mandala_desc": get(src, "home", "gallery", "cards", "mandala", "desc"),
        "mission_label": get(src, "home", "mission", "label"),
        "mission_title": get(src, "home", "mission", "title"),
        "mission_subtitle": get(src, "home", "mission", "subtitle"),
        "feature_education_title": get(src, "home", "mission", "features", "education", "title"),
        "feature_education_desc": get(src, "home", "mission", "features", "education", "desc"),
        "feature_arts_title": get(src, "home", "mission", "features", "tours", "title"),
        "feature_arts_desc": get(src, "home", "mission", "features", "tours", "desc"),
        "feature_prayer_title": get(src, "home", "mission", "features", "prayers", "title"),
        "feature_prayer_desc": get(src, "home", "mission", "features", "prayers", "desc"),
        "feature_culture_title": get(src, "home", "mission", "features", "preservation", "title"),
        "feature_culture_desc": get(src, "home", "mission", "features", "preservation", "desc"),
        "feature_community_title": get(src, "home", "mission", "features", "community", "title"),
        "feature_community_desc": get(src, "home", "mission", "features", "community", "desc"),
        "feature_lamp_title": get(src, "home", "mission", "features", "butterLamp", "title"),
        "feature_lamp_desc": get(src, "home", "mission", "features", "butterLamp", "desc"),
        "cta_title": get(src, "home", "cta", "title"),
        "cta_text": get(src, "home", "cta", "text"),
        "cta_learn_buddhism": get(src, "home", "cta", "ctaLearn"),
    }

    # --- donate ---
    out["donate"] = {
        "about_text": get(src, "donate", "about", "text"),
        "section_label": get(src, "donate", "donationSection", "label"),
        "section_title": get(src, "donate", "donationSection", "title"),
        "section_subtitle": get(src, "donate", "donationSection", "subtitle"),
        "one_time": get(src, "donate", "donationSection", "frequency", "oneTime"),
        "monthly": get(src, "donate", "donationSection", "frequency", "monthly"),
        "currency_label": get(src, "donate", "donationSection", "currencyLabel"),
        "custom_placeholder": get(src, "donate", "donationSection", "customAmountPlaceholder"),
        "monthly_note": get(src, "donate", "donationSection", "monthlyNote"),
        "donate_now": get(src, "donate", "donationSection", "donateButton"),
        "secure_note": get(src, "donate", "donationSection", "secureNote"),
        "sponsor_label": get(src, "donate", "sponsorship", "label"),
        "sponsor_title": get(src, "donate", "sponsorship", "title"),
        "sponsor_subtitle": get(src, "donate", "sponsorship", "subtitle"),
    }

    # Sponsorship cards
    for card_key, flat_key in [
        ("meals", "meals"), ("education", "education"), ("medical", "medical"),
        ("building", "building"), ("tour", "tour"), ("butterLamp", "lamp"),
    ]:
        card = get(src, "donate", "sponsorship", "cards", card_key) or {}
        out["donate"][f"sponsor_{flat_key}_title"] = card.get("title")
        out["donate"][f"sponsor_{flat_key}_desc"] = card.get("desc")
        out["donate"][f"sponsor_{flat_key}_action"] = card.get("action")

    # Payment
    out["donate"]["payment_label"] = get(src, "donate", "payment", "label")
    out["donate"]["payment_title"] = get(src, "donate", "payment", "title")
    out["donate"]["payment_subtitle"] = get(src, "donate", "payment", "subtitle")

    # Donor form
    out["donate"]["form_label"] = get(src, "donate", "donorForm", "label")
    out["donate"]["form_title"] = get(src, "donate", "donorForm", "title")
    out["donate"]["form_subtitle"] = get(src, "donate", "donorForm", "subtitle")
    out["donate"]["form_name"] = get(src, "donate", "donorForm", "fields", "fullName")
    out["donate"]["form_email"] = get(src, "donate", "donorForm", "fields", "email")
    out["donate"]["form_phone"] = get(src, "donate", "donorForm", "fields", "phone")
    out["donate"]["form_phone_optional"] = get(src, "donate", "donorForm", "fields", "phoneOptional")
    out["donate"]["form_country"] = get(src, "donate", "donorForm", "fields", "country")
    out["donate"]["form_country_select"] = get(src, "donate", "donorForm", "fields", "selectCountry")
    out["donate"]["form_dedication"] = get(src, "donate", "donorForm", "fields", "dedication")
    out["donate"]["form_dedication_none"] = get(src, "donate", "donorForm", "fields", "noDedication")
    out["donate"]["form_dedication_honor"] = get(src, "donate", "donorForm", "fields", "inHonorOf")
    out["donate"]["form_dedication_memory"] = get(src, "donate", "donorForm", "fields", "inMemoryOf")
    out["donate"]["form_dedication_merit"] = get(src, "donate", "donorForm", "fields", "dedicatedToMerit")
    out["donate"]["form_dedication_name"] = get(src, "donate", "donorForm", "fields", "dedicationName")
    out["donate"]["form_message"] = get(src, "donate", "donorForm", "fields", "messageToMonks")
    out["donate"]["form_message_optional"] = get(src, "donate", "donorForm", "fields", "messageOptional")
    out["donate"]["form_anonymous"] = get(src, "donate", "donorForm", "checkboxes", "anonymous")
    out["donate"]["form_receipt"] = get(src, "donate", "donorForm", "checkboxes", "taxReceipt")
    out["donate"]["form_updates"] = get(src, "donate", "donorForm", "checkboxes", "updates")
    out["donate"]["form_submit"] = get(src, "donate", "donorForm", "submitButton")

    # --- faq (from generalUnderstanding) ---
    gu = src.get("generalUnderstanding", {})
    faq = {
        "hero_title": get(gu, "hero", "title"),
        "hero_tagline": get(gu, "hero", "tagline"),
        "welcome_title": get(gu, "intro", "title"),
        "welcome_text": get(gu, "intro", "text"),
    }

    # FAQ groups
    faq_data = gu.get("faq", {})

    # Tibetan Buddhism
    tb = faq_data.get("tibetanBuddhism", {})
    faq["group_buddhism"] = tb.get("groupTitle")
    faq["q_what_is_buddhism"] = get(tb, "q1", "question")
    faq["a_what_is_buddhism"] = get(tb, "q1", "answer")
    faq["q_gelug"] = get(tb, "q2", "question")
    faq["a_gelug"] = get(tb, "q2", "answer")
    faq["q_khangtsen"] = get(tb, "q3", "question")
    faq["a_khangtsen"] = get(tb, "q3", "answer")
    faq["q_four_truths"] = get(tb, "q4", "question")
    faq["a_four_truths"] = get(tb, "q4", "answer")

    # Pujas & Prayers
    pp = faq_data.get("pujasAndPrayers", {})
    faq["group_pujas"] = pp.get("groupTitle")
    faq["q_what_is_puja"] = get(pp, "q1", "question")
    faq["a_what_is_puja"] = get(pp, "q1", "answer")
    faq["q_puja_types"] = get(pp, "q2", "question")
    faq["a_puja_types"] = get(pp, "q2", "answer")
    faq["q_request_puja"] = get(pp, "q3", "question")
    faq["a_request_puja"] = get(pp, "q3", "answer")
    faq["q_butter_lamp"] = get(pp, "q4", "question")
    faq["a_butter_lamp"] = get(pp, "q4", "answer")

    # Monastery
    mon = faq_data.get("monastery", {})
    faq["group_monastery"] = mon.get("groupTitle")
    faq["q_where"] = get(mon, "q1", "question")
    faq["a_where"] = get(mon, "q1", "answer")
    faq["q_study"] = get(mon, "q2", "question")
    faq["a_study"] = get(mon, "q2", "answer")
    faq["q_visit"] = get(mon, "q3", "question")
    faq["a_visit"] = get(mon, "q3", "answer")
    faq["q_support"] = get(mon, "q4", "question")
    faq["a_support"] = get(mon, "q4", "answer")

    # Sand Mandalas
    sm = faq_data.get("sandMandalas", {})
    faq["group_mandala"] = sm.get("groupTitle")
    faq["q_what_is_mandala"] = get(sm, "q1", "question")
    faq["a_what_is_mandala"] = get(sm, "q1", "answer")
    faq["q_why_destroyed"] = get(sm, "q2", "question")
    faq["a_why_destroyed"] = get(sm, "q2", "answer")
    faq["q_where_see"] = get(sm, "q3", "question")
    faq["a_where_see"] = get(sm, "q3", "answer")

    # FAQ CTA
    faq["cta_title"] = get(gu, "cta", "title")
    faq["cta_text"] = get(gu, "cta", "text")
    faq["cta_contact"] = get(gu, "cta", "ctaContact")

    out["faq"] = faq

    # --- footer ---
    out["footer"] = {
        "name": get(src, "footer", "monasteryName"),
        "address": get(src, "footer", "monasteryName"),  # placeholder — address is HTML, set per-lang below
    }

    # Strip None values
    def strip_none(d):
        if isinstance(d, dict):
            return {k: strip_none(v) for k, v in d.items() if v is not None}
        return d

    return strip_none(out)


# Footer address per language (HTML with <br> tags — not in locale files)
FOOTER_ADDRESSES = {
    "en": "P.O. Tibetan Colony, Mundgod<br>N. Kanara, Karnataka 581411, India<br>info@gadengungru.com",
    "bo": "བོད་མིའི་གཞིས་ཆགས་ མཱན་གོཌ<br>ཀར་ན་ཊ་ཀ ༥༨༡༤༡༡ རྒྱ་གར།<br>info@gadengungru.com",
    "hi": "पी.ओ. तिब्बती कॉलोनी, मुंडगोड<br>उ. कनारा, कर्नाटक 581411, भारत<br>info@gadengungru.com",
    "zh-TW": "西藏殖民地郵政局，芒果德<br>北卡納拉，卡納塔克邦 581411，印度<br>info@gadengungru.com",
    "kn": "ಪಿ.ಒ. ಟಿಬೆಟನ್ ಕಾಲೋನಿ, ಮುಂಡ್‌ಗೋಡ್<br>ಉ. ಕನ್ನಡ, ಕರ್ನಾಟಕ 581411, ಭಾರತ<br>info@gadengungru.com",
    "fr": "P.O. Colonie tib\u00e9taine, Mundgod<br>N. Kanara, Karnataka 581411, Inde<br>info@gadengungru.com",
    "es": "P.O. Colonia tibetana, Mundgod<br>N. Kanara, Karnataka 581411, India<br>info@gadengungru.com",
    "dz": "བོད་མིའི་གཞིས་ཆགས་ མཱན་གོཌ<br>ཀར་ན་ཊ་ཀ ༥༨༡༤༡༡ རྒྱ་གར།<br>info@gadengungru.com",
    "ja": "P.O. チベット人居住区、ムンドゴッド<br>N.カナラ、カルナータカ州 581411、インド<br>info@gadengungru.com",
    "mr": "पी.ओ. तिबेटी वसाहत, मुंडगोड<br>उ. कनारा, कर्नाटक 581411, भारत<br>info@gadengungru.com",
    "ne": "पी.ओ. तिब्बती कलोनी, मुन्डगोड<br>उ. कनारा, कर्नाटक 581411, भारत<br>info@gadengungru.com",
    "ta": "பி.ஓ. திபெத்திய குடியேற்றம், முண்ட்கோட்<br>வ. கனரா, கர்நாடகா 581411, இந்தியா<br>info@gadengungru.com",
    "te": "పి.ఓ. టిబెటన్ కాలనీ, ముండ్‌గోడ్<br>ఉ. కనారా, కర్ణాటక 581411, భారతదేశం<br>info@gadengungru.com",
}


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    locale_files = sorted(f for f in os.listdir(LOCALES_DIR) if f.endswith('.json'))
    count = 0

    for filename in locale_files:
        lang_code = filename.replace('.json', '')
        src_path = os.path.join(LOCALES_DIR, filename)

        with open(src_path, 'r', encoding='utf-8') as f:
            src = json.load(f)

        result = convert(src)

        # Set footer address
        if lang_code in FOOTER_ADDRESSES:
            result["footer"]["address"] = FOOTER_ADDRESSES[lang_code]
        else:
            # Fallback to English address
            result["footer"]["address"] = FOOTER_ADDRESSES["en"]

        out_path = os.path.join(OUTPUT_DIR, filename)
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

        count += 1
        print(f"  {lang_code}.json")

    print(f"\nConverted {count} locale files to {OUTPUT_DIR}")


if __name__ == '__main__':
    main()
