"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
`;

const Section = styled.div`
  margin-top: 2rem;
`;

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h1>📊 Admin Dashboard</h1>

      <Grid>
        <Card><h3>👤 Kullanıcı Sayısı</h3><p>{stats.totalUsers}</p></Card>
        <Card><h3>📅 Randevular</h3><p>{stats.totalAppointments}</p></Card>
        <Card><h3>💸 Siparişler</h3><p>{stats.totalOrders}</p></Card>
        <Card><h3>💰 Toplam Gelir</h3><p>{stats.totalRevenue} €</p></Card>
      </Grid>

      <Section>
        <h2>🕵️ Son Kullanıcılar</h2>
        <ul>
          {stats.recentUsers.map((u: any) => (
            <li key={u._id}>{u.name} – {u.email}</li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2>🧾 Son Siparişler</h2>
        <ul>
          {stats.recentOrders.map((o: any, i: number) => (
            <li key={i}>💳 {o.totalPrice} € – {new Date(o.createdAt).toLocaleDateString()}</li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2>🏆 En Çok Sipariş Edilen Ürünler</h2>
        <ul>
          {stats.topProducts.map((p: any, i: number) => (
            <li key={i}>{p.name} – {p.totalSold} adet</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
