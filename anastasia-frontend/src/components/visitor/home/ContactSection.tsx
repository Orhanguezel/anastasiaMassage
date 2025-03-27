"use client";

import styled from "styled-components";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Section = styled(motion.section)`
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.backgroundAlt || "#f1f1f5"};
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const Info = styled.p`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

const SocialIcons = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;

  a {
    color: ${({ theme }) => theme.primary || "rebeccapurple"};
    font-size: 1.6rem;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.primaryHover || "indigo"};
    }
  }
`;

export default function ContactSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Title>📍 {t("contact.title", "İletişim")}</Title>

      <Info>
        📌 {t("contact.addressLabel", "Adres")}:{" "}
        {t("contact.address", "Örnek Mahallesi, Wellness Sokak No: 12, İstanbul")}
      </Info>
      <Info>
        📞 {t("contact.phoneLabel", "Telefon")}:{" "}
        {t("contact.phone", "+90 532 123 45 67")}
      </Info>
      <Info>
        📧 {t("contact.emailLabel", "E-posta")}:{" "}
        {t("contact.email", "info@anastasia.com")}
      </Info>

      <SocialIcons>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebook />
        </a>
        <a
          href="https://wa.me/905321234567"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </a>
      </SocialIcons>
    </Section>
  );
}
