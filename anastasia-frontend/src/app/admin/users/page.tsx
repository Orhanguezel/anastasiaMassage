"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  background: #fff;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  background: #eee;
  padding: 10px;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button<{ color?: string }>`
  margin-right: 6px;
  padding: 6px 10px;
  background-color: ${({ color }) => color || "#3498db"};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/user/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id: string, role: string) => {
    const token = localStorage.getItem("token");
    await axios.put(`/user/users/${id}/role`, { role }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const toggleStatus = async (id: string) => {
    const token = localStorage.getItem("token");
    await axios.put(`/user/users/${id}/status`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/user/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  return (
    <div>
      <h1>👥 Kullanıcı Yönetimi</h1>
      <Table>
        <thead>
          <tr>
            <Th>Ad Soyad</Th>
            <Th>E-posta</Th>
            <Th>Rol</Th>
            <Th>Durum</Th>
            <Th>İşlem</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u._id}>
              <Td>{u.name}</Td>
              <Td>{u.email}</Td>
              <Td>{u.role}</Td>
              <Td>{u.isActive ? "Aktif" : "Bloklu"}</Td>
              <Td>
                <Button color="#2ecc71" onClick={() => changeRole(u._id, u.role === "admin" ? "user" : "admin")}>
                  {u.role === "admin" ? "User yap" : "Admin yap"}
                </Button>
                <Button color="#e67e22" onClick={() => toggleStatus(u._id)}>
                  {u.isActive ? "Blokla" : "Aktifleştir"}
                </Button>
                <Button color="#e74c3c" onClick={() => deleteUser(u._id)}>Sil</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
