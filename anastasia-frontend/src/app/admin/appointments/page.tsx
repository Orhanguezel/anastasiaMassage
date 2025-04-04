"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styled from "styled-components";
import { toast } from "react-toastify";

type Appointment = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  date: string;
  time: string;
  note?: string;
  status: string;
};

const Wrapper = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.cardBackground || "#fff"};
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.backgroundAlt || "#eee"};
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button<{ color?: string }>`
  margin-right: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  color: #fff;
  background-color: ${({ color }) => color || "#3498db"};
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      toast.error("Randevular alınamadı.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Randevu ${status === "confirmed" ? "onaylandı" : "iptal edildi"}`);
      fetchData();
    } catch (err) {
      toast.error("Durum güncellenemedi");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Randevu silindi");
      fetchData();
    } catch (err) {
      toast.error("Silme başarısız");
    }
  };

  return (
    <Wrapper>
      <Title>📅 Randevular</Title>
      <Table>
        <thead>
          <tr>
            <Th>Ad</Th>
            <Th>Email</Th>
            <Th>Telefon</Th>
            <Th>Masaj</Th>
            <Th>Tarih</Th>
            <Th>Not</Th>
            <Th>Durum</Th>
            <Th>İşlem</Th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <Td>{a.name}</Td>
              <Td>{a.email}</Td>
              <Td>{a.phone}</Td>
              <Td>{a.serviceType}</Td>
              <Td>{a.date} – {a.time}</Td>
              <Td>{a.note || "-"}</Td>
              <Td>{a.status}</Td>
              <Td>
                <Button color="#2ecc71" onClick={() => handleStatus(a._id, "confirmed")}>
                  Onayla
                </Button>
                <Button color="#e67e22" onClick={() => handleStatus(a._id, "cancelled")}>
                  İptal
                </Button>
                <Button color="#e74c3c" onClick={() => handleDelete(a._id)}>
                  Sil
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
}
