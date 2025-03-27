import styled from "styled-components";
import Link from "next/link";
import type { ReactNode } from "react";

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 220px;
  background-color: #222;
  color: #fff;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #fafafa;
`;

const NavItem = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #f39c12;
  }
`;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Wrapper>
      <Sidebar>
        <h2 style={{ color: "#f39c12" }}>Admin Panel</h2>
        <NavItem href="/admin/dashboard">📊 Dashboard</NavItem>
        <NavItem href="/admin/appointments">📅 Randevular</NavItem>
        <NavItem href="/admin/products">🛍️ Ürünler</NavItem>
        <NavItem href="/admin/blogs">📰 Blog</NavItem>
        <NavItem href="/admin/users">👥 Kullanıcılar</NavItem>
      </Sidebar>
      <Main>{children}</Main>
    </Wrapper>
  );
}
