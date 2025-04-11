"use client";

import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "@/lib/api";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 16px;
  top: 16px;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 0.95rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 0.3rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
`;

const Button = styled.button`
  margin-top: 1rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
`;

interface Props {
  order: any;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: Props) {
  const [status, setStatus] = React.useState(order.status);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const handleStatusChange = async () => {
    try {
      await axios.put(
        `/orders/${order._id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Sipariş durumu güncellendi");
      onClose(); // modalı kapat
    } catch (err) {
      toast.error("❌ Güncelleme başarısız");
    }
  };

  return (
    <Overlay>
      <Modal>
        <CloseBtn onClick={onClose}>
          <FaTimes />
        </CloseBtn>

        <Section>
          <Label>Müşteri:</Label>
          <Value>
            {order.user?.name} – {order.user?.email}
          </Value>
        </Section>

        <Section>
          <Label>Toplam Tutar:</Label>
          <Value>€ {order.total}</Value>
        </Section>

        <Section>
          <Label>Ürünler:</Label>
          {order.items.map((item: any) => (
            <Value key={item._id}>
              {item.name} – €{item.price} x {item.quantity}
            </Value>
          ))}
        </Section>

        <Section>
          <Label>Durum:</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="hazırlanıyor">Hazırlanıyor</option>
            <option value="kargoda">Kargoda</option>
            <option value="teslim edildi">Teslim Edildi</option>
          </Select>
        </Section>

        <Button onClick={handleStatusChange}>Durumu Güncelle</Button>
      </Modal>
    </Overlay>
  );
}
