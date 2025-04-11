"use client";

import { useState } from "react";
import styled from "styled-components";
import axios from "@/lib/api";

const Form = styled.form`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 10px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
`;

export default function AppointmentPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    date: "",
    time: "",
    note: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post("/appointments", form);
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        date: "",
        time: "",
        note: "",
      });
    } catch (err) {
      alert("Hata oluştu!");
      console.error(err);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>🗓️ Randevu Al</h1>

      <Form onSubmit={handleSubmit}>
        <Select
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
          required
        >
          <option value="">Masaj Türü Seçin</option>
          <option value="Aromaterapi Masajı">Aromaterapi Masajı</option>
          <option value="Refleksoloji">Refleksoloji</option>
          <option value="Derin Doku Masajı">Derin Doku Masajı</option>
          <option value="Anti-selülit Masajı">Anti-selülit Masajı</option>
        </Select>

        <Input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <Input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        />

        <Input
          name="name"
          placeholder="Ad Soyad"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          name="phone"
          placeholder="Telefon"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <Textarea
          name="note"
          placeholder="Not (isteğe bağlı)"
          rows={3}
          value={form.note}
          onChange={handleChange}
        />

        <Button type="submit">Randevu Oluştur</Button>

        {success && (
          <p style={{ color: "green", textAlign: "center" }}>
            ✅ Randevunuz başarıyla oluşturuldu.
          </p>
        )}
      </Form>
    </div>
  );
}
