"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProducts, deleteProduct } from "@/store/productsSlice";
import styled from "styled-components";
import { toast } from "react-toastify";
import ProductFilters from "./components/ProductFilters";
import ProductTable from "./components/ProductTable";
import ProductFormModal from "./components/ProductFormModal";
import { IProduct } from "@/types/product";

const Wrapper = styled.div`
  padding: 2rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const AddButton = styled.button`
  background: #7f3f98;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #682c87;
  }
`;

export default function AdminProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.products);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const refresh = () => dispatch(fetchProducts());

  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "all" || p.category === category)
    );
  }, [products, search, category]);

  const handleDelete = (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

    dispatch(deleteProduct(id))
      .unwrap()
      .then(() => {
        toast.success("Ürün silindi");
        refresh();
      })
      .catch(() => toast.error("Silme işlemi başarısız"));
  };

  return (
    <Wrapper>
      <TopBar>
        <ProductFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />
        <AddButton
          onClick={() => {
            setSelectedProduct(null);
            setShowModal(true);
          }}
        >
          ➕ Yeni Ürün
        </AddButton>
      </TopBar>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <ProductTable
          products={filtered}
          onEdit={(product: IProduct) => {
            setSelectedProduct(product);
            setShowModal(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {showModal && (
        <ProductFormModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            refresh();
          }}
        />
      )}
    </Wrapper>
  );
}
