"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import Link from "next/link";

const Container = styled.div`
  max-width: 1100px;
  margin: 2rem auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const AddButton = styled(Link)`
  background: #27ae60;
  color: #fff;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  margin-bottom: 1rem;
  display: inline-block;

  &:hover {
    background: #219150;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.backgroundSecondary};
`;

const Th = styled.th`
  padding: 12px;
  background: ${({ theme }) => theme.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.border || "#ccc"};
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#eee"};
`;

const Image = styled.img`
  width: 60px;
  height: auto;
  border-radius: 4px;
`;

const Button = styled.button<{ color?: string }>`
  padding: 6px 12px;
  background: ${({ color }) => color || "#3498db"};
  color: white;
  border: none;
  border-radius: 6px;
  margin-right: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

interface Product {
  _id: string;
  name: string;
  image?: string;
  price: number;
  stock: number;
  category: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      toast.error("Ürünler alınamadı");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ürün silindi");
      fetchProducts();
    } catch (err) {
      toast.error("Silme işlemi başarısız");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container>
      <Title>🛍️ Ürün Yönetimi</Title>
      <AddButton href="/admin/products/create">➕ Yeni Ürün</AddButton>
      <Table>
        <thead>
          <tr>
            <Th>Görsel</Th>
            <Th>Ad</Th>
            <Th>Kategori</Th>
            <Th>Fiyat (€)</Th>
            <Th>Stok</Th>
            <Th>İşlemler</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <Td>{p.image ? <Image src={p.image} alt={p.name} /> : "-"}</Td>
              <Td>{p.name}</Td>
              <Td>{p.category}</Td>
              <Td>{p.price}</Td>
              <Td>{p.stock}</Td>
              <Td>
                <Link href={`/admin/products/edit/${p._id}`}>
                  <Button>Düzenle</Button>
                </Link>
                <Button color="#e74c3c" onClick={() => handleDelete(p._id)}>
                  Sil
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
