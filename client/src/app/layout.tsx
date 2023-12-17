import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/global.css";
import { Locale, i18n } from "@root/i18n.config";
import { get } from "lodash";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { cache } from "react";

// const metadata: Metadata = {
//   title: t("website.title"),
//   description: t("website.description"),
//   openGraph: {
//     images: "https://meetifynow.com/imgs/og-image.webp",
//     url: t("website.url"),
//     description: t("website.description"),
//     siteName: "MeetifyNow",
//     type: "website",
//     title: "MeetifyNow",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "MeetifyNow",
//     description: t("website.description"),
//     images: "https://meetifynow.com/imgs/og-image.webp",
//   },
// };

export async function generateStaticParams() {
  return i18n.locales.map((locale: Locale) => ({ lang: locale }));
}

export const getLocale = cache((): Locale => {
  const preference = headers().get("X-Language-Preference");
  console.log(preference);
  return (preference ?? "en") as Locale;
});

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale; id?: string };
}) {
  console.log(getLocale());
  return (
    <html lang={params.lang}>
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
        <Navbar lang={params.lang} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
