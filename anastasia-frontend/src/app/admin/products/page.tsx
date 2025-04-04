"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import ProductFormModal from "@/components/admin/ProductFormModal";
import { useTranslation } from "react-i18next";

const PageWrapper = styled.div`
  padding: 2rem;
`;

const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
  background: ${({ theme }) => theme.inputBackground || "#fff"};
  color: ${({ theme }) => theme.text};
  flex: 1;
  min-width: 180px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
  background: ${({ theme }) => theme.inputBackground || "#fff"};
  color: ${({ theme }) => theme.text};
`;

const AddButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 10px 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  overflow: hidden;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.background};
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#ddd"};
  vertical-align: middle;
`;

const ImageThumb = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
`;

const Button = styled.button<{ color?: string }>`
  padding: 6px 12px;
  margin-right: 6px;
  background: ${({ color }) => color || "#3498db"};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { t } = useTranslation();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error(t("product.fetchError"));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let temp = [...products];
    if (search) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== "all") {
      temp = temp.filter((p) => p.category === category);
    }
    setFiltered(temp);
  }, [search, category, products]);

  const handleDelete = async (id: string) => {
    if (!confirm(t("product.confirmDelete"))) return;

    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t("product.deleted"));
      fetchProducts();
    } catch (err) {
      toast.error(t("product.deleteError"));
    }
  };

  const categories = ["all", "vitamin", "yağ", "bitkisel", "diğer"];

  return (
    <PageWrapper>
      <TopBar>
        <Title>{t("product.pageTitle")}</Title>
        <SearchInput
          placeholder={t("product.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? t("product.all") : cat}
            </option>
          ))}
        </Select>
        <AddButton onClick={() => {
          setSelectedProduct(null);
          setShowModal(true);
        }}>
          {t("product.add")}
        </AddButton>
      </TopBar>

      <Table>
        <thead>
          <tr>
            <Th>{t("product.image")}</Th>
            <Th>{t("product.name")}</Th>
            <Th>{t("product.category")}</Th>
            <Th>{t("product.price")}</Th>
            <Th>{t("product.stock")}</Th>
            <Th>{t("product.actions")}</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p: any) => (
            <tr key={p._id}>
              <Td>
                {p.image ? (
                  <ImageThumb
                    src={`http://localhost:5011/${p.image}`}
                    alt={p.name}
                  />
                ) : (
                  <span style={{ color: "#aaa", fontSize: "0.85rem" }}>–</span>
                )}
              </Td>
              <Td>{p.name}</Td>
              <Td>{p.category}</Td>
              <Td>€ {p.price}</Td>
              <Td>{p.stock}</Td>
              <Td>
                <Button
                  color="#f39c12"
                  onClick={() => {
                    setSelectedProduct(p);
                    setShowModal(true);
                  }}
                >
                  {t("common.edit")}
                </Button>
                <Button
                  color="#e74c3c"
                  onClick={() => handleDelete(p._id)}
                >
                  {t("common.delete")}
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <ProductFormModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchProducts();
            setShowModal(false);
          }}
        />
      )}
    </PageWrapper>
  );
}
