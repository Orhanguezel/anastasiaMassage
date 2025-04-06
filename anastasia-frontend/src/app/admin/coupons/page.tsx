"use client";

import styled from "styled-components";
import CouponForm from "./CouponForm";
import CouponList from "./CouponList";
import { useSelector } from "react-redux";
import { RootState } from "@/store";


const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: 1rem;
`;

export default function AdminCouponsPage() {
  const { error, successMessage } = useSelector((state: RootState) => state.coupon);

  return (
    <Container>
      <Title>Kupon Yönetimi</Title>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <CouponForm />
      <CouponList />
    </Container>
  );
}
