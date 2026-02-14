import type { Metadata } from "next";
import { i18n, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

const fontFamilyMap: Record<Locale, string> = {
  en: "var(--font-geist), sans-serif",
  bo: "'Noto Sans Tibetan', sans-serif",
  hi: "'Noto Sans Devanagari', sans-serif",
  "zh-TW": "'Noto Sans TC', sans-serif",
  kn: "'Noto Sans Kannada', sans-serif",
  fr: "var(--font-geist), sans-serif",
  es: "var(--font-geist), sans-serif",
  dz: "'Noto Sans Tibetan', sans-serif",
  ja: "'Noto Sans JP', sans-serif",
  mr: "'Noto Sans Devanagari', sans-serif",
  ne: "'Noto Sans Devanagari', sans-serif",
  ta: "'Noto Sans Tamil', sans-serif",
  te: "'Noto Sans Telugu', sans-serif",
  vi: "var(--font-geist), sans-serif",
  "zh-CN": "'Noto Sans SC', sans-serif",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return (
    <div style={{ fontFamily: fontFamilyMap[lang] }} className="flex flex-col min-h-screen">
      <AuthProvider>
        <Navbar dict={dict} lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer dict={dict} />
      </AuthProvider>
    </div>
  );
}
