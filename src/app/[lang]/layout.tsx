import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { i18n, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

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
  bo: "'Noto Sans Tibetan', sans-serif",
  hi: "'Noto Sans Devanagari', sans-serif",
  kn: "'Noto Sans Kannada', sans-serif",
  zh: "'Noto Sans SC', sans-serif",
  en: "var(--font-geist), sans-serif",
  fr: "var(--font-geist), sans-serif",
  es: "var(--font-geist), sans-serif",
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
    <html lang={lang} className={geist.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tibetan:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Kannada:wght@400;700&family=Noto+Sans+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased bg-background text-foreground"
        style={{ fontFamily: fontFamilyMap[lang] }}
      >
        <Navbar dict={dict} lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
