"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styled from "styled-components";
import { toast } from "react-toastify";

const Container = styled.div`
  max-width: 1000px;
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
  color: ${({ theme }) => theme.text};
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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Kullanıcılar alınamadı");
    }
  };

  const changeRole = async (id: string, role: string) => {
    try {
      await axios.put(
        `/users/${id}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Rol güncellendi");
      fetchUsers();
    } catch (err) {
      toast.error("Rol güncelleme hatası");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await axios.put(
        `/users/${id}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Durum güncellendi");
      fetchUsers();
    } catch (err) {
      toast.error("Durum güncelleme hatası");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Kullanıcı silindi");
      fetchUsers();
    } catch (err) {
      toast.error("Silme işlemi başarısız");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container>
      <Title>👤 Kullanıcı Yönetimi</Title>
      <Table>
        <thead>
          <tr>
            <Th>Ad</Th>
            <Th>Email</Th>
            <Th>Rol</Th>
            <Th>Aktif</Th>
            <Th>İşlemler</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <Td>{u.name}</Td>
              <Td>{u.email}</Td>
              <Td>{u.role}</Td>
              <Td>{u.isActive ? "✅" : "❌"}</Td>
              <Td>
                <Button onClick={() => changeRole(u._id, u.role === "admin" ? "user" : "admin")}>
                  {u.role === "admin" ? "Kullanıcı Yap" : "Admin Yap"}
                </Button>
                <Button color="#e67e22" onClick={() => toggleStatus(u._id)}>
                  Durum Değiştir
                </Button>
                <Button color="#e74c3c" onClick={() => deleteUser(u._id)}>
                  Sil
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
