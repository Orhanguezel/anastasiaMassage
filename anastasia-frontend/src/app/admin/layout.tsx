// app/admin/layout.tsx
"use client";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.background};
`;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <Sidebar />
      <Content>
        <Header />
        {children}
      </Content>
    </Wrapper>
  );
}
