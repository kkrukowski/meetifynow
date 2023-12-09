import withNextIntl from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "./dist",
  i18n: {
    locales: ["en", "pl"],
    defaultLocale: "en",
    localeDetection: false,
  },
  trailingSlash: true,
};

export default nextConfig;
