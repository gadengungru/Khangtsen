import { NextRequest, NextResponse } from "next/server";
import { i18n } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

function getLocaleFromHeaders(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return i18n.defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, q] = lang.trim().split(";q=");
      return { code: code.split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { code } of preferred) {
    const match = i18n.locales.find((locale) => locale === code);
    if (match) return match;
  }

  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/admin")
  ) {
    return;
  }

  // Check if the pathname already has a valid locale
  const pathnameLocale = i18n.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) return;

  // Redirect to preferred locale
  const locale = getLocaleFromHeaders(request);
  return NextResponse.redirect(
    new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
  );
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
