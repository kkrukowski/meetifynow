import { NextRequest, NextResponse } from "next/server";
export { auth as authMiddleware } from "@src/auth"

import { match as matchLocale } from "@formatjs/intl-localematcher";
import { i18n } from "@root/i18n.config";
import Negotiator from "negotiator";

const headerName = "X-Language-Preference";

function getLocale(req: NextRequest): string | "" {
  const negotiatorHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export async function middleware(req: NextRequest) {
  const locales: string[] = i18n.locales;
  let siteLocale = i18n.defaultLocale;

  // Get the locale from the request and set headers
  let response = NextResponse.next();
  const { pathname } = req.nextUrl;
  const pathnameHasLocale = locales.some((locale) => {
    siteLocale = locale;
    return pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
  });

  if (pathnameHasLocale) {
    response.headers.set(headerName, siteLocale);
    return response;
  }

  // Skip middleware for public assets
  const isPublicAsset = pathname.startsWith('/imgs') || pathname === '/imgs/og-image.webp';
  if (isPublicAsset) {
    return NextResponse.next();
  }

  // Redirect if there is no locale
  siteLocale = getLocale(req);
  req.nextUrl.pathname = `/${siteLocale}${pathname}`;
  return new NextResponse(null, {
    status: 302,
    headers: {
      headerName: siteLocale,
      Location: req.nextUrl.toString(),
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|imgs).*)",
  ],
};
