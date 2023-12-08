import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  const { t, i18n } = useTranslation();
  return (
    <HelmetProvider>
      <Helmet htmlAttributes={{ lang: i18n.language }}></Helmet>
      <Navbar />
      <Outlet />
      <Footer />
    </HelmetProvider>
  );
}
