export const i18n = {
  defaultLocale: "en",
  locales: ["en", "bo", "hi", "zh", "kn", "fr", "es"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const INTRANET_LOCALES: Locale[] = ["en", "bo"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  bo: "བོད་སྐད་",
  hi: "हिन्दी",
  zh: "中文",
  kn: "ಕನ್ನಡ",
  fr: "Français",
  es: "Español",
};

export const localeFlags: Record<Locale, string> = {
  en: "\u{1F1EC}\u{1F1E7}",
  bo: "\u{1F3F3}\u{FE0F}",
  hi: "\u{1F1EE}\u{1F1F3}",
  zh: "\u{1F1E8}\u{1F1F3}",
  kn: "\u{1F1EE}\u{1F1F3}",
  fr: "\u{1F1EB}\u{1F1F7}",
  es: "\u{1F1EA}\u{1F1F8}",
};
