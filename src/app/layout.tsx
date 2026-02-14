import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Khangtsen",
  description: "Preserving and promoting Tibetan culture, education, and community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tibetan:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Kannada:wght@400;700&family=Noto+Sans+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
