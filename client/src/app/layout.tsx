import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/global.css";
import { Locale, i18n } from "@root/i18n.config";
import { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { cache } from "react";
import { getDictionary } from "./lib/dictionary";

export async function generateStaticParams() {
  return i18n.locales.map((locale: Locale) => ({ lang: locale }));
}

const getLocale = cache((): Locale => {
  const preference = headers().get("X-Language-Preference");
  return (preference ?? "en") as Locale;
});

export async function generateMetadata() {
  const dict = await getDictionary(getLocale() as Locale);

  const metadata: Metadata = {
    title: dict.website.title,
    description: dict.website.description,
    openGraph: {
      images: "https://meetifynow.com/imgs/og-image.webp",
      url: dict.website.url,
      description: dict.website.description,
      siteName: "MeetifyNow",
      type: "website",
      title: "MeetifyNow",
    },
    twitter: {
      card: "summary_large_image",
      title: "MeetifyNow",
      description: dict.website.description,
      images: "https://meetifynow.com/imgs/og-image.webp",
    },
  };

  return metadata;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();

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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-17HZ4W39MP"
        ></Script>
        <Script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());

            gtag('config', 'G-17HZ4W39MP');
            `}
        </Script>
      </head>
      <body>
        <Navbar lang={locale} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
