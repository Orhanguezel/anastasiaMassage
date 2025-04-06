"use client";

import styled from "styled-components";
import { IProduct } from "@/types/product";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.backgroundSecondary || "#fff"};
  color: ${({ theme }) => theme.text || "#000"};
  font-size: 0.95rem;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.backgroundAlt || "#f0f0f0"};
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#ddd"};
  vertical-align: middle;
`;

const Img = styled.img`
  width: 60px;
  height: auto;
  border-radius: 6px;
  object-fit: cover;
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

interface ProductTableProps {
  products: IProduct[];
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {

  return (
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
            <Td>
              {p.image ? (
                <Img src={`${p.image}`} alt={p.name} />
              ) : (
                "–"
              )}
            </Td>
            <Td>{p.name}</Td>
            <Td>{p.category}</Td>
            <Td>€ {p.price}</Td>
            <Td>{p.stockRef?.quantity ?? "–"}</Td>
            <Td>
              <Button color="#f39c12" onClick={() => onEdit(p)}>
                Düzenle
              </Button>
              <Button color="#e74c3c" onClick={() => onDelete(p._id)}>
                Sil
              </Button>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
