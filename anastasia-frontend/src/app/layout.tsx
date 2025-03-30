// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import Providers from "@/app/providers/Providers";

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
        <meta
          name="description"
          content="Doğallığın dokunuşuyla sağlığınızı şımartın"
        />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"rel="stylesheet"/>
      </head>

      {/* suppressHydrationWarning eklendi */}
      <body suppressHydrationWarning={true}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
