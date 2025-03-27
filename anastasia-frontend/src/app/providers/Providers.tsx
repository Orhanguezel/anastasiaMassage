"use client";

import React from "react";
import I18nProvider from "@/components/I18nProvider";
import ThemeProviderWrapper from "@/app/providers/ThemeProviderWrapper";
import ReduxProvider from "@/app/providers/ReduxProvider";
import Navbar from "@/components/visitor/shared/Navbar";
import FooterSection from "@/components/visitor/home/FooterSection";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProviderWrapper>
        <I18nProvider>
          <Navbar />
          <main>{children}</main>
          <FooterSection />
        </I18nProvider>
      </ThemeProviderWrapper>
    </ReduxProvider>
  );
}
