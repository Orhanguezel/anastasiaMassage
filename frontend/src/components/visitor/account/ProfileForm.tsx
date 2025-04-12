"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUserProfile, clearProfileMessages } from "@/store/user/profileSlice";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

// ✅ Gerekli props tipi
interface Props {
  profile: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
}

const FormWrapper = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.backgroundAlt};
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: rebeccapurple;
  color: white;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: indigo;
  }
`;

const Message = styled.p<{ success?: boolean }>`
  color: ${({ success }) => (success ? "green" : "red")};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

// 🔁 Profile prop'u alınacak
export default function ProfileForm({ profile }: Props) {
  const dispatch = useAppDispatch();
  const { loading, error, successMessage } = useAppSelector((state) => state.profile);
  const { t } = useTranslation();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserProfile({ name, email, phone }));
  };

  useEffect(() => {
    return () => {
      dispatch(clearProfileMessages());
    };
  }, [dispatch]);

  return (
    <FormWrapper>
      <h2>{t("profile.form.title")}</h2>

      {successMessage && <Message success>{successMessage}</Message>}
      {error && <Message>{error}</Message>}

      <form onSubmit={handleSubmit}>
        <label>{t("profile.form.name")}</label>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>{t("profile.form.email")}</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>{t("profile.form.phone")}</label>
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <Button type="submit" disabled={loading}>
          {loading ? t("profile.form.saving") : t("profile.form.save")}
        </Button>
      </form>
    </FormWrapper>
  );
}
