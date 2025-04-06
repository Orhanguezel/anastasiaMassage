"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "@/store/appointmentsSlice";
import { toast } from "react-toastify";

const Container = styled.div`
  max-width: 1100px;
  margin: 2rem auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.backgroundSecondary};
`;

const Th = styled.th`
  text-align: left;
  padding: 10px;
  background: ${({ theme }) => theme.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.border || "#ccc"};
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#eee"};
`;

const Button = styled.button<{ color?: string }>`
  padding: 6px 12px;
  background: ${({ color }) => color || "#3498db"};
  color: white;
  border: none;
  border-radius: 6px;
  margin-right: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export default function AppointmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, loading } = useSelector((state: RootState) => state.appointments);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleStatusChange = (id: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === "pending"
        ? "confirmed"
        : currentStatus === "confirmed"
        ? "cancelled"
        : "pending";

    dispatch(updateAppointmentStatus({ id, status: nextStatus }))
      .unwrap()
      .then(() => toast.success("Randevu durumu güncellendi"))
      .catch(() => toast.error("Durum güncelleme hatası"));
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu randevuyu silmek istediğinize emin misiniz?")) {
      dispatch(deleteAppointment(id))
        .unwrap()
        .then(() => toast.success("Randevu silindi"))
        .catch(() => toast.error("Silme işlemi başarısız"));
    }
  };

  return (
    <Container>
      <Title>📅 Randevu Yönetimi</Title>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Ad</Th>
              <Th>Email</Th>
              <Th>Hizmet</Th>
              <Th>Tarih</Th>
              <Th>Saat</Th>
              <Th>Durum</Th>
              <Th>İşlem</Th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <Td>{appt.name}</Td>
                <Td>{appt.email}</Td>
                <Td>{appt.service?.title || appt.serviceType}</Td>
                <Td>{appt.date}</Td>
                <Td>{appt.time}</Td>
                <Td>{appt.status}</Td>
                <Td>
                  <Button
                    onClick={() => handleStatusChange(appt._id, appt.status || "pending")}
                    color="#f39c12"
                  >
                    Durum Değiştir
                  </Button>
                  <Button
                    onClick={() => handleDelete(appt._id)}
                    color="#e74c3c"
                  >
                    Sil
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
