"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/accountSlice";
import { loginUser } from "@/store/user/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const { loading, user } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      await dispatch(fetchCurrentUser());
      toast.success(t("login.success"));
      router.push("/admin");
    } else {
      toast.error(t("login.error"));
    }

    setForm({ email: "", password: "" });
  };

  useEffect(() => {
    if (user?._id || user?.email) {
      router.push("/admin");
    }
  }, [user, router]);

  return (
    <Wrapper>
      <Title>{t("login.title")}</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder={t("login.email")}
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder={t("login.password")}
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? t("login.loading") : t("login.submit")}
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
