"use client";

import Link from "next/link";
import styled from "styled-components";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/user/authSlice"; // ✅ doğru thunk
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store"; // typing


export default function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      router.push("/login");
    }
  };

  return (
    <SidebarWrapper>
      <MenuLink href="/admin">
        <FaHome />
        Dashboard
      </MenuLink>
      <MenuLink href="/admin/appointments">
        <FaCalendarAlt />
        Randevular
      </MenuLink>
      <MenuLink href="/admin/products">
        <FaBoxOpen />
        Ürünler
      </MenuLink>
      <MenuLink href="/admin/users">
        <FaUsers />
        Kullanıcılar
      </MenuLink>

      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt />
        Çıkış Yap
      </LogoutButton>
    </SidebarWrapper>
  );
}


const SidebarWrapper = styled.aside`
  width: 240px;
  background: ${({ theme }) => theme.backgroundSecondary};
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-right: 1px solid ${({ theme }) => theme.border || "#eee"};
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  color: ${({ theme }) => theme.text};

  &:hover {
    background: ${({ theme }) => theme.backgroundAlt || "#f4f4f4"};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.danger || "crimson"};
  cursor: pointer;
  margin-top: auto;

  &:hover {
    background: rgba(255, 0, 0, 0.05);
  }
`;
