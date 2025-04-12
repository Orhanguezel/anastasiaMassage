"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import I18nProvider from "@/components/I18nProvider";
import ThemeProviderWrapper from "@/app/providers/ThemeProviderWrapper";
import ReduxProvider from "@/app/providers/ReduxProvider";
import Navbar from "@/components/visitor/shared/Navbar";
import FooterSection from "@/components/visitor/home/FooterSection";
import { fetchCurrentUser } from "@/store/accountSlice";
import type { AppDispatch } from "@/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProviderWrapper>
        <I18nProvider>
          <InitUserLoader />
          <Navbar />
          <main>{children}</main>
          <FooterSection />
        </I18nProvider>
      </ThemeProviderWrapper>
    </ReduxProvider>
  );
}


function InitUserLoader() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUser());
    
  }, [dispatch]);

  return null;
}

