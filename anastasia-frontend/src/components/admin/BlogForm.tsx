"use client";
import { useState } from "react";
import axios from "@/lib/api";
import styled from "styled-components";

const Form = styled.form`
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Button = styled.button`
  padding: 10px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
`;

interface Props {
  blog?: any;
  onSuccess: () => void;
}

export default function BlogForm({ blog, onSuccess }: Props) {
  const [form, setForm] = useState({
    title: blog?.title || "",
    content: blog?.content || "",
    category: blog?.category || "",
    author: blog?.author || "Admin",
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      if (blog?._id) {
        await axios.put(`/blogs/${blog._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/blogs", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
    } catch (err) {
      console.error("Hata:", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>{blog ? "📝 Yazıyı Güncelle" : "➕ Yeni Blog Yazısı"}</h3>
      <Input
        name="title"
        placeholder="Başlık"
        value={form.title}
        onChange={handleChange}
      />
      <TextArea
        name="content"
        rows={5}
        placeholder="İçerik"
        value={form.content}
        onChange={handleChange}
      />
      <Input
        name="category"
        placeholder="Kategori (vegan, beslenme...)"
        value={form.category}
        onChange={handleChange}
      />
      <Input
        name="author"
        placeholder="Yazar"
        value={form.author}
        onChange={handleChange}
      />
      <Input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <Button type="submit">{blog ? "Güncelle" : "Ekle"}</Button>
    </Form>
  );
}
