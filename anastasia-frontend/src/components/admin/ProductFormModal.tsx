"use client";

import React, { useState } from "react";
import styled from "styled-components";
import axios from "@/lib/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
  background: ${({ theme }) => theme.inputBackground || "#fff"};
  color: ${({ theme }) => theme.text};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  height: 80px;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
  background: ${({ theme }) => theme.inputBackground || "#fff"};
  color: ${({ theme }) => theme.text};
  resize: vertical;
`;

const Button = styled.button<{ danger?: boolean }>`
  background: ${({ danger, theme }) => (danger ? "#e74c3c" : theme.primary)};
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 1rem;

  &:hover {
    opacity: 0.9;
  }
`;

interface Props {
  product?: any;
  onSuccess: () => void;
  onClose: () => void;
}

export default function ProductFormModal({
  product,
  onSuccess,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const [image, setImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    category: product?.category || "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      if (product?._id) {
        await axios.put(`/products/${product._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(t("product.updated"));
      } else {
        await axios.post(`/products`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(t("product.added"));
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(t("product.error"));
    }
  };

  return (
    <Overlay>
      <Modal>
        <Title>
          {product ? t("product.updateTitle") : t("product.addTitle")}
        </Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            placeholder={t("product.name")}
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextArea
            name="description"
            placeholder={t("product.description")}
            value={form.description}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="price"
            placeholder={t("product.price")}
            value={form.price}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="stock"
            placeholder={t("product.stock")}
            value={form.stock}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="category"
            placeholder={t("product.category")}
            value={form.category}
            onChange={handleChange}
            required
          />

          {/* Görsel ekleme */}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit">
              {product ? t("product.update") : t("product.add")}
            </Button>
            <Button type="button" danger onClick={onClose}>
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </Modal>
    </Overlay>
  );
}
