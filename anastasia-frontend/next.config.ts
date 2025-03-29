/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["tr", "en", "de"],
    defaultLocale: "tr",
  },
  output: "standalone", 
};

module.exports = nextConfig;
