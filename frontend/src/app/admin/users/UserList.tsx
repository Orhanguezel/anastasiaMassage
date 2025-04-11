"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchUsers,
  deleteUser,
} from "@/store/user/userCrudSlice";
import {
  toggleUserStatus,
  updateUserRole,
} from "@/store/user/userStatusSlice";
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

export default function UserList() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.userCrud);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const refreshUsers = () => dispatch(fetchUsers());

  const handleRoleChange = (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    dispatch(updateUserRole({ id, role: newRole }))
      .unwrap()
      .then(() => {
        toast.success("Rol güncellendi");
        refreshUsers(); // 🔁 Listeyi yenile
      })
      .catch((err) => toast.error(err));
  };

  const handleStatusToggle = (id: string) => {
    dispatch(toggleUserStatus(id))
      .unwrap()
      .then(() => {
        toast.success("Durum güncellendi");
        refreshUsers(); // 🔁 Listeyi yenile
      })
      .catch((err) => toast.error(err));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id))
      .unwrap()
      .then(() => {
        toast.success("Kullanıcı silindi");
        refreshUsers(); // 🔁 Listeyi yenile
      })
      .catch((err) => toast.error(err));
  };

  return (
    <Container>
      <Title>👤 Kullanıcı Yönetimi</Title>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
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
                  <Button onClick={() => handleRoleChange(u._id, u.role)}>
                    {u.role === "admin" ? "Kullanıcı Yap" : "Admin Yap"}
                  </Button>
                  <Button color="#e67e22" onClick={() => handleStatusToggle(u._id)}>
                    Durum Değiştir
                  </Button>
                  <Button color="#e74c3c" onClick={() => handleDelete(u._id)}>
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
