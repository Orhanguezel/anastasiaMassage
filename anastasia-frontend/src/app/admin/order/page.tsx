"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import OrderDetailModal from "@/components/admin/OrderDetailModal";

const PageWrapper = styled.div`
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  overflow: hidden;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.background};
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#ddd"};
  vertical-align: middle;
`;

const Button = styled.button<{ color?: string }>`
  padding: 6px 12px;
  margin-right: 6px;
  background: ${({ color }) => color || "#3498db"};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("❌ Siparişler alınamadı");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <PageWrapper>
      <Title>📦 Siparişler</Title>
      <Table>
        <thead>
          <tr>
            <Th>Kullanıcı</Th>
            <Th>Email</Th>
            <Th>Toplam (€)</Th>
            <Th>Durum</Th>
            <Th>Tarih</Th>
            <Th>İşlem</Th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order._id}>
              <Td>{order.user?.name}</Td>
              <Td>{order.user?.email}</Td>
              <Td>{order.total}</Td>
              <Td>{order.status}</Td>
              <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
              <Td>
                <Button onClick={() => setSelectedOrder(order)}>
                  Detay
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </PageWrapper>
  );
}
