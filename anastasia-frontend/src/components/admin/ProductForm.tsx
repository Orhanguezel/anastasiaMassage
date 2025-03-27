"use client";
import { useState } from "react";
import axios from "@/lib/axios";
import styled from "styled-components";

const Form = styled.form`
  background: #fff;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
`;

const Button = styled.button`
  background-color: #27ae60;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #219150;
  }
`;

interface Props {
  product?: any;
  onSuccess: () => void;
}

export default function ProductForm({ product, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    category: product?.category || "",
    tags: product?.tags?.join(", ") || "",
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "tags") {
        formData.append(key, JSON.stringify(value.split(",").map(t => t.trim())));
      } else {
        formData.append(key, value);
      }
    });

    if (image) formData.append("image", image);

    try {
      if (product?._id) {
        await axios.put(`/products/${product._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess();
    } catch (err) {
      alert("Hata oluştu!");
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>{product ? "📝 Ürün Güncelle" : "➕ Yeni Ürün Ekle"}</h3>
      <Input placeholder="Ürün Adı" name="name" value={form.name} onChange={handleChange} />
      <TextArea placeholder="Açıklama" name="description" rows={4} value={form.description} onChange={handleChange} />
      <Input type="number" placeholder="Fiyat (€)" name="price" value={form.price} onChange={handleChange} />
      <Input type="number" placeholder="Stok" name="stock" value={form.stock} onChange={handleChange} />
      <Input placeholder="Kategori (örn: vitamin, yag)" name="category" value={form.category} onChange={handleChange} />
      <Input placeholder="Etiketler (virgülle)" name="tags" value={form.tags} onChange={handleChange} />
      <Input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <Button type="submit">{product ? "Güncelle" : "Ekle"}</Button>
    </Form>
  );
}
