"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { removeFromCart, updateQuantity, clearCart } from "@/store/cartSlice";
import { useState } from "react";
import axios from "@/lib/axios";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
`;

const Table = styled.table`
  width: 100%;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 1rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
`;

export default function CartPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const total = items.reduce(
    (acc, i) => acc + i.product.price * i.quantity,
    0
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post("/orders", {
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
        })),
        shippingAddress: form,
        totalPrice: total,
      });
      alert("✅ Sipariş başarıyla oluşturuldu!");
      dispatch(clearCart());
    } catch (err) {
      alert("❌ Sipariş gönderilemedi.");
    }
  };

  return (
    <Container>
      <h1>🛒 Sepetiniz</h1>
      {items.length === 0 ? <p>Sepet boş.</p> : (
        <>
          <Table>
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Adet</th>
                <th>Fiyat</th>
                <th>Sil</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.product._id}>
                  <td>{i.product.name}</td>
                  <td>
                    <input
                      type="number"
                      value={i.quantity}
                      min={1}
                      onChange={(e) => dispatch(updateQuantity({ id: i.product._id, qty: +e.target.value }))}
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td>{i.product.price * i.quantity} €</td>
                  <td>
                    <button onClick={() => dispatch(removeFromCart(i.product._id))}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h3>Toplam: {total.toFixed(2)} €</h3>

          <form onSubmit={handleSubmit}>
            <Input name="name" placeholder="Ad Soyad" required onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input name="phone" placeholder="Telefon" required onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input name="street" placeholder="Adres" required onChange={(e) => setForm({ ...form, street: e.target.value })} />
            <Input name="city" placeholder="Şehir" required onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input name="postalCode" placeholder="Posta Kodu" required onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
            <Input name="country" placeholder="Ülke" required onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <Button type="submit">🚚 Siparişi Gönder (Kapıda Ödeme)</Button>
          </form>
        </>
      )}
    </Container>
  );
}
