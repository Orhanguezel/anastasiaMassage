"use client";

import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createCoupon } from "@/store/couponSlice";
import { AppDispatch } from "@/store";

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  input,
  button {
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }

  button {
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
    border: none;
    cursor: pointer;
  }

  input[type="number"] {
    max-width: 120px;
  }

  input[type="date"] {
    max-width: 200px;
  }
`;

const Error = styled.div`
  color: red;
  font-size: 0.9rem;
  width: 100%;
`;

export default function CouponForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({ code: "", discount: "", expiresAt: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const now = new Date();
    const selectedDate = new Date(form.expiresAt);

    // 🎯 Validation
    if (!form.code.trim() || !form.discount || !form.expiresAt) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    const discountNumber = Number(form.discount);
    if (isNaN(discountNumber) || discountNumber <= 0 || discountNumber > 100) {
      setError("İndirim oranı 1 ile 100 arasında olmalıdır.");
      return;
    }

    if (selectedDate <= now) {
      setError("Tarih bugünden ileri bir gün olmalı.");
      return;
    }

    dispatch(
      createCoupon({
        code: form.code.trim(),
        discount: discountNumber,
        expiresAt: form.expiresAt,
      })
    );

    setForm({ code: "", discount: "", expiresAt: "" });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Kod"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="İndirim (%)"
        step="1"
        value={form.discount}
        onChange={(e) => setForm({ ...form, discount: e.target.value })}
        required
      />
      <input
        type="date"
        value={form.expiresAt}
        onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
        required
      />
      <button type="submit">Ekle</button>
      {error && <Error>{error}</Error>}
    </Form>
  );
}

