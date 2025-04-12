"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { registerUser } from "@/store/user/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";


export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const { loading, user } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form) as any);
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(t("register.success"));
      router.push("/login");
    } else {
      toast.error(t("register.error"));
    }
  };

  useEffect(() => {
    if (user?._id || user?.email) {
      router.push("/admin");
    }
  }, [user, router]);

  return (
    <Wrapper>
      <Title>{t("register.title")}</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder={t("register.name")}
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder={t("register.email")}
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder={t("register.password")}
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? t("register.loading") : t("register.submit")}
        </Button>
      </form>
    </Wrapper>
  );
}


const Wrapper = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  background: ${({ theme }) => theme.backgroundSecondary};
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
  border-radius: 6px;
  background: ${({ theme }) => theme.inputBackground || "#fff"};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.primary || "#5a2ea6"};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.primaryHover || "#4b2491"};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
