import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  const { t, i18n } = useTranslation();
  return (
    <HelmetProvider>
      <Helmet htmlAttributes={{ lang: i18n.language }}>
        <title>{t("website.title")}</title>
        <meta name="description" content={t("website.description")} />
        <meta property="og:url" content={t("website.url")} />
        <meta property="og:description" content={t("website.description")} />
        <meta name="twitter:description" content={t("website.description")} />
        <meta property="twitter:url" content={t("website.url")} />
      </Helmet>
      <Navbar />
      <Outlet />
      <Footer />
    </HelmetProvider>
  );
}
