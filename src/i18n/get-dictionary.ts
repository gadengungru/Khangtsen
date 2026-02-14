import type { Locale } from "./config";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  bo: () => import("./dictionaries/bo.json").then((m) => m.default),
  hi: () => import("./dictionaries/hi.json").then((m) => m.default),
  "zh-TW": () => import("./dictionaries/zh-TW.json").then((m) => m.default),
  kn: () => import("./dictionaries/kn.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  dz: () => import("./dictionaries/dz.json").then((m) => m.default),
  ja: () => import("./dictionaries/ja.json").then((m) => m.default),
  mr: () => import("./dictionaries/mr.json").then((m) => m.default),
  ne: () => import("./dictionaries/ne.json").then((m) => m.default),
  ta: () => import("./dictionaries/ta.json").then((m) => m.default),
  te: () => import("./dictionaries/te.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]();
};
