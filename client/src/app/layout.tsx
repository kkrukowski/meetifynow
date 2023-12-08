import type { Metadata } from "next";
// import { useTranslation } from "react-i18next";

// const { t } = useTranslation();
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        {/* <script type="application/ld+json">
            {
            "@context" : "https://schema.org",
            "@type" : "WebSite",
            "name" : "MeetifyNow",
            "alternateName" : "MN",
            "url" : "https://meetifynow.com/"
            }
        </script>
        <script async src=" https://www.googletagmanager.com/gtag/js?id=G-17HZ4W39MP">
        </script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());

            gtag('config', 'G-17HZ4W39MP');
        </script> */}
      </head>

      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}