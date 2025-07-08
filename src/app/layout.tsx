import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar.tsx";
import "@/global.css";
import { Locale, i18n } from "@root/i18n.config";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import Script from "next/script";
import { getDictionary } from "./lib/dictionary";

export async function generateStaticParams() {
  return i18n.locales.map((locale: Locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  const baseUrl = "https://meetifynow.com";

  return {
    title: dict.website.title,
    description: dict.website.description,
    openGraph: {
      images: `${baseUrl}/imgs/og-image.webp`,
      url: `${baseUrl}/${params.lang}`,
      description: dict.website.description,
      siteName: "MeetifyNow",
      type: "website",
      title: "MeetifyNow",
    },
    twitter: {
      card: "summary_large_image",
      title: "MeetifyNow",
      description: dict.website.description,
      images: `${baseUrl}/imgs/og-image.webp`,
    },
    alternates: {
      canonical: `${baseUrl}/${params.lang}`,
      languages: {
        en: `${baseUrl}/en`,
        pl: `${baseUrl}/pl`,
      },
    },
  };
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const { lang: locale } = params;

  return (
    <html lang={locale}>
      <head>
        <Script type="application/ld+json">
          {`
            {
                "@context" : "https://schema.org",
                "@type" : "WebSite",
                "name" : "MeetifyNow",
                "alternateName" : "MN",
                "url" : "https://meetifynow.com/"
            }
        `}
        </Script>
      </head>
      <body>
        <Navbar lang={locale} />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
