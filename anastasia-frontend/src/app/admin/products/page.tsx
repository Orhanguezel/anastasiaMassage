"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styled from "styled-components";
import ProductForm from "@/components/admin/ProductForm";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  margin-top: 1.5rem;
`;

const Th = styled.th`
  background: #eee;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button<{ color?: string }>`
  padding: 6px 12px;
  margin-right: 6px;
  background-color: ${({ color }) => color || "#3498db"};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  const fetchData = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      alert("Silme hatası");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>🛍️ Ürünler</h1>

      {/* TODO: Ürün ekleme formu buraya gelecek */}

      <Table>
        <thead>
          <tr>
            <Th>Görsel</Th>
            <Th>İsim</Th>
            <Th>Fiyat</Th>
            <Th>Stok</Th>
            <Th>Kategori</Th>
            <Th>İşlem</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p._id}>
              <Td><img src={p.image} alt="" width="50" /></Td>
              <Td>{p.name}</Td>
              <Td>{p.price} €</Td>
              <Td>{p.stock}</Td>
              <Td>{p.category}</Td>
              <Td>
                <Button color="#2ecc71">Düzenle</Button>
                <Button color="#e74c3c" onClick={() => handleDelete(p._id)}>Sil</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ProductForm onSuccess={fetchData} />
    </div>
  );
}
