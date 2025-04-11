"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createProduct, updateProduct } from "@/store/productsSlice";
import { IProduct } from "@/types/product";
import { toast } from "react-toastify";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 2rem;
  max-width: 600px;
  margin: 8vh auto;
  border-radius: 12px;
  position: relative;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin: 1rem 0 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ color?: string }>`
  padding: 10px 18px;
  background: ${({ color }) => color || "#2ecc71"};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

interface Props {
  product?: IProduct | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductFormModal({ product, onClose, onSuccess }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setCategory(product.category);
      setDescription(product.description || "");
    }
  }, [product]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("description", description);
    if (image) formData.append("image", image);
  
    const action = product
      ? updateProduct({ id: product._id, formData })
      : createProduct(formData);
  
    dispatch(action as any) 
      .unwrap()
      .then(() => {
        toast.success(product ? "Ürün güncellendi" : "Ürün oluşturuldu");
        onSuccess();
      })
      .catch((err: unknown) => {
        if (err && typeof err === "object" && "message" in err) {
          toast.error((err as { message: string }).message);
        } else {
          toast.error("Bilinmeyen hata oluştu");
        }
      });
      
      
  };
  

  return (
    <Overlay>
      <Modal>
        <h3>{product ? "📝 Ürünü Düzenle" : "➕ Yeni Ürün"}</h3>

        <Label>Adı</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />

        <Label>Fiyat (€)</Label>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <Label>Kategori</Label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} />

        <Label>Açıklama</Label>
        <TextArea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Label>Görsel</Label>
        <Input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />

        <ButtonGroup>
          <Button onClick={handleSubmit}>{product ? "Kaydet" : "Oluştur"}</Button>
          <Button color="#e74c3c" onClick={onClose}>İptal</Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
}
