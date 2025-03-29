/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["tr", "en", "de"],
    defaultLocale: "tr",
  },
  output: "standalone",
};

module.exports = nextConfig;
