"use client";

import styled from "styled-components";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FaLeaf, FaSpa, FaHandsHelping, FaHeartbeat } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Section = styled(motion.section)`
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.background};
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.cardBackground || "#f9f9f9"};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.primary || "rebeccapurple"};
  margin-bottom: 1rem;
`;

const Label = styled.p`
  font-weight: 600;
`;

const SeeAll = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  color: ${({ theme }) => theme.primary || "rebeccapurple"};
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function ServicesSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const services = [
    {
      icon: <FaLeaf />,
      label: t("home.services.aromatherapy", "Aromaterapi Masajı"),
    },
    {
      icon: <FaSpa />,
      label: t("home.services.reflexology", "Refleksoloji"),
    },
    {
      icon: <FaHandsHelping />,
      label: t("home.services.deepTissue", "Derin Doku Masajı"),
    },
    {
      icon: <FaHeartbeat />,
      label: t("home.services.antiCellulite", "Anti-selülit Masajı"),
    },
  ];

  return (
    <Section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Title>💆‍♀️ {t("home.services.title", "Hizmetlerimiz")}</Title>
      <Grid>
        {services.map((s, index) => (
          <Card
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <IconWrapper>{s.icon}</IconWrapper>
            <Label>{s.label}</Label>
          </Card>
        ))}
      </Grid>
      <SeeAll href="/visitor/services">
        {t("home.services.all", "Tüm Hizmetleri Gör →")}
      </SeeAll>
    </Section>
  );
}
