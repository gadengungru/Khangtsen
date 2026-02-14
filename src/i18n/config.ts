export const i18n = {
  defaultLocale: "en",
  locales: ["en", "bo", "hi", "zh-TW", "kn", "fr", "es", "dz", "ja", "mr", "ne", "ta", "te", "vi", "zh-CN"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const INTRANET_LOCALES: Locale[] = ["en", "bo"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  bo: "བོད་སྐད་",
  hi: "हिन्दी",
  "zh-TW": "中文",
  kn: "ಕನ್ನಡ",
  fr: "Français",
  es: "Español",
  dz: "རྫོང་ཁ",
  ja: "日本語",
  mr: "मराठी",
  ne: "नेपाली",
  ta: "தமிழ்",
  te: "తెలుగు",
  vi: "Tiếng Việt",
  "zh-CN": "简体中文",
};

export const localeFlags: Record<Locale, string> = {
  en: "\u{1F1EC}\u{1F1E7}",
  bo: "\u{1F3F3}\u{FE0F}",
  hi: "\u{1F1EE}\u{1F1F3}",
  "zh-TW": "\u{1F1F9}\u{1F1FC}",
  kn: "\u{1F1EE}\u{1F1F3}",
  fr: "\u{1F1EB}\u{1F1F7}",
  es: "\u{1F1EA}\u{1F1F8}",
  dz: "\u{1F1E7}\u{1F1F9}",
  ja: "\u{1F1EF}\u{1F1F5}",
  mr: "\u{1F1EE}\u{1F1F3}",
  ne: "\u{1F1F3}\u{1F1F5}",
  ta: "\u{1F1EE}\u{1F1F3}",
  te: "\u{1F1EE}\u{1F1F3}",
  vi: "\u{1F1FB}\u{1F1F3}",
  "zh-CN": "\u{1F1F8}\u{1F1EC}",
};
