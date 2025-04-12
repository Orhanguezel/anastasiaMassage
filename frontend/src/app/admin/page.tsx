"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import { getDashboardStats } from "@/store/dashboardSlice";

import {
  MdPeople,
  MdCalendarToday,
  MdShoppingBag,
  MdReceipt,
  MdLocalOffer,
  MdSpa,
  MdEmail,
  MdArticle,
  MdImage,
  MdMarkEmailRead,
  MdFeedback,
  MdNotifications,
  MdSettings,
} from "react-icons/md";


export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const { stats, loading: statsLoading } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }

    if (user) {
      dispatch(getDashboardStats());
    }
  }, [user, authLoading, dispatch, router]);

  if (authLoading || statsLoading) return <div>Loading...</div>;
  if (!user) return <div>Unauthorized</div>;

  return (
    <Container>
      <Title>Admin Panel</Title>
      <Welcome>
        Merhaba <strong>{user?.name}</strong>, hoş geldiniz 👋
      </Welcome>

      <StatGrid>
        <Card onClick={() => router.push("/admin/users")}>
          <StatIcon>
            <MdPeople />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.users ?? "-"}</StatValue>
            <StatLabel>Kullanıcılar</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/appointments")}>
          <StatIcon>
            <MdCalendarToday />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.appointments ?? "-"}</StatValue>
            <StatLabel>Randevular</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/products")}>
          <StatIcon>
            <MdShoppingBag />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.products ?? "-"}</StatValue>
            <StatLabel>Ürünler</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/orders")}>
          <StatIcon>
            <MdReceipt />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.orders ?? "-"}</StatValue>
            <StatLabel>Siparişler</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/coupons")}>
          <StatIcon>
            <MdLocalOffer />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.coupons ?? "-"}</StatValue>
            <StatLabel>Kuponlar</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/services")}>
          <StatIcon>
            <MdSpa />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.services ?? "-"}</StatValue>
            <StatLabel>Hizmetler</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/emails")}>
          <StatIcon>
            <MdEmail />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.emails ?? "-"}</StatValue>
            <StatLabel>E-Postalar</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/blogs")}>
          <StatIcon>
            <MdArticle />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.blogs ?? "-"}</StatValue>
            <StatLabel>Blog Yazıları</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/gallery")}>
          <StatIcon>
            <MdImage />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.gallery ?? "-"}</StatValue>
            <StatLabel>Galeri</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/messages")}>
          <StatIcon>
            <MdMarkEmailRead />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.contactMessages ?? "-"}</StatValue>
            <StatLabel>İletişim Mesajları</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/feedbacks")}>
          <StatIcon>
            <MdFeedback />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.feedbacks ?? "-"}</StatValue>
            <StatLabel>Geri Bildirim</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/notifications")}>
          <StatIcon>
            <MdNotifications />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.notifications ?? "-"}</StatValue>
            <StatLabel>Bildirimler</StatLabel>
          </StatInfo>
        </Card>

        <Card onClick={() => router.push("/admin/settings")}>
          <StatIcon>
            <MdSettings />
          </StatIcon>
          <StatInfo>
            <StatValue>-</StatValue>
            <StatLabel>Site Ayarları</StatLabel>
          </StatInfo>
        </Card>
      </StatGrid>
    </Container>
  );
}


const Container = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const Welcome = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBackground || "#fff"};
  padding: 1.2rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.primary};
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
`;
