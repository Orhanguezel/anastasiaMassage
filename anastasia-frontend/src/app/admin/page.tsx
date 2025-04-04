"use client";

import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Container = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: 1rem;
`;

const Welcome = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBackground || "#fff"};
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StatValue = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.textSecondary};
`;

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Container>
      <Title>Admin Panel</Title>
      <Welcome>Merhaba <strong>{user?.name}</strong>, hoş geldiniz 👋</Welcome>

      <StatGrid>
        <Card>
          <StatValue>12</StatValue>
          <StatLabel>Aktif Randevu</StatLabel>
        </Card>
        <Card>
          <StatValue>8</StatValue>
          <StatLabel>Yeni Kayıt</StatLabel>
        </Card>
        <Card>
          <StatValue>24</StatValue>
          <StatLabel>Toplam Ürün</StatLabel>
        </Card>
        <Card>
          <StatValue>5</StatValue>
          <StatLabel>Yeni Blog</StatLabel>
        </Card>
      </StatGrid>
    </Container>
  );
}
