"use client";

import styled from "styled-components";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const FooterWrapper = styled.footer`
  padding: 2rem 1rem;
  background: ${({ theme }) => theme.backgroundAlt || "#eaeaea"};
  color: ${({ theme }) => theme.text};
  text-align: center;
  font-size: 0.9rem;
  border-top: 1px solid ${({ theme }) => theme.border || "#ddd"};
`;

const Menu = styled.div`
  margin-bottom: 1rem;

  a {
    margin: 0 0.8rem;
    color: ${({ theme }) => theme.text};
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${({ theme }) => theme.primary || "rebeccapurple"};
      text-decoration: underline;
    }
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.textSecondary || "#777"};
  font-size: 0.8rem;
`;

export default function FooterSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <FooterWrapper>
      <Menu>
        <Link href="/visitor/privacy">{t("footer.privacy", "Gizlilik")}</Link>
        <Link href="/visitor/kvkk">{t("footer.kvkk", "KVKK")}</Link>
        <Link href="/visitor/about">{t("footer.about", "Hakkımızda")}</Link>
        <Link href="/visitor/appointment">
          {t("footer.appointment", "Randevu")}
        </Link>
      </Menu>
      <Copyright>
        © {new Date().getFullYear()} Anastasia König Massagesalon{" "}
        {t("footer.rights", "Tüm hakları saklıdır.")}.
      </Copyright>
    </FooterWrapper>
  );
}
