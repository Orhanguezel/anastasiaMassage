"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchCoupons,
  deleteCoupon,
  updateCoupon,
} from "@/store/couponSlice";

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Item = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 0.4rem 0.6rem;
  margin-left: 0.5rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;

  &.edit {
    background-color: #4caf50;
  }
  &.delete {
    background-color: #f44336;
  }
`;

const Toggle = styled.button<{ $active: boolean }>`
  padding: 0.3rem 0.6rem;
  background-color: ${({ $active }) => ($active ? "green" : "gray")};
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const ModalBackground = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  padding: 2rem;
  border-radius: 10px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;

  button {
    padding: 0.5rem 1rem;
    background-color: ${({ theme }) => theme.primary};
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  span {
    padding: 0.5rem 1rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

export default function CouponList() {
  const dispatch = useDispatch<AppDispatch>();
  const { coupons, loading } = useSelector((state: RootState) => state.coupon);

  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [form, setForm] = useState({ code: "", discount: "", expiresAt: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const couponsPerPage = 5;

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Kupon silinsin mi?")) dispatch(deleteCoupon(id));
  };

  const openEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      discount: coupon.discount.toString(),
      expiresAt: coupon.expiresAt.slice(0, 10),
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateCoupon({
        id: editingCoupon._id,
        data: {
          code: form.code,
          discount: Number(form.discount),
          expiresAt: form.expiresAt,
        },
      })
    );
    setEditingCoupon(null);
  };

  const handleToggleActive = (coupon: any) => {
    dispatch(
      updateCoupon({
        id: coupon._id,
        data: { isActive: !coupon.isActive },
      })
    );
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage);
  const start = (page - 1) * couponsPerPage;
  const paginatedCoupons = filteredCoupons.slice(start, start + couponsPerPage);

  return (
    <>
      {loading && <p>Yükleniyor...</p>}

      <SearchInput
        type="text"
        placeholder="Kupon kodu ara..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <List>
        {paginatedCoupons.map((coupon) => (
          <Item key={coupon._id}>
            <div>
              <strong>{coupon.code}</strong> – %{coupon.discount} |{" "}
              <small>
                {new Date(coupon.expiresAt).toLocaleDateString()}
              </small>
              {!coupon.isActive && <em> (Pasif)</em>}
            </div>
            <div>
              <Toggle
                $active={coupon.isActive}
                onClick={() => handleToggleActive(coupon)}
              >
                {coupon.isActive ? "Aktif" : "Pasif"}
              </Toggle>
              <Button className="edit" onClick={() => openEdit(coupon)}>
                Düzenle
              </Button>
              <Button
                className="delete"
                onClick={() => handleDelete(coupon._id!)}
              >
                Sil
              </Button>
            </div>
          </Item>
        ))}
      </List>

      {totalPages > 1 && (
        <PaginationWrapper>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Geri
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            İleri
          </button>
        </PaginationWrapper>
      )}

      {editingCoupon && (
        <ModalBackground onClick={() => setEditingCoupon(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Kuponu Güncelle</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
                required
              />
              <input
                type="number"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value })
                }
                required
              />
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
                required
              />
              <button type="submit">Kaydet</button>
            </form>
          </ModalContent>
        </ModalBackground>
      )}
    </>
  );
}
