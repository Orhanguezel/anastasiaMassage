/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["tr", "en", "de"],
    defaultLocale: "tr",
    // ❗ App Router'da bu alan desteklenmiyor:
    // localeDetection: true, 
  },
  output: "standalone",
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    serverActions: {}, // ✅ boolean yerine boş obje olmalı
    optimizeCss: true,
    typedRoutes: false,
  },
  images: {
    domains: [
      "localhost",
      "via.placeholder.com",       // ✅ dış kaynak eklendi
      "https://koenigsmassage.com/",      // varsa prod alan adını da ekleyebilirsin
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
