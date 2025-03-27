"use client";

import Link from "next/link";
import styled from "styled-components";

const Section = styled.section`
  padding: 2rem;
  background: #fffaf4;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const Button = styled(Link)`
  padding: 10px 20px;
  background: #27ae60;
  color: white;
  border-radius: 6px;
  display: inline-block;
  margin-top: 1rem;
`;

export default function HomePage() {
  return (
    <Section>
      <Title>Anastasia König Masaj Salonu</Title>
      <p>Doğallığın dokunuşuyla sağlığınızı şımartın.</p>

      <Button href="/visitor/appointment">🗓️ Randevu Al</Button>
      <br />
      <Button href="/visitor/products" style={{ background: "#2980b9", marginTop: "1rem" }}>
        🛍️ Ürünleri Gör
      </Button>
    </Section>
  );
}
