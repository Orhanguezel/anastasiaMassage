// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import Providers from "@/app/providers/Providers";
import ToastProvider from "@/app/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Anastasia König Massagesalon",
  description: "Doğallığın dokunuşuyla sağlığınızı şımartın",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Doğallığın dokunuşuyla sağlığınızı şımartın" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers>
          <main>{children}</main>
          <ToastProvider /> {/* ✅ client component içinde kullanıyoruz */}
        </Providers>
      </body>
    </html>
  );
}
