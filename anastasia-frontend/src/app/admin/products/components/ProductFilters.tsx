import styled from "styled-components";



const Input = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  margin-right: 1rem;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
`;

interface ProductFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
}

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
}: ProductFiltersProps) {
  const categories = ["all", "vitamin", "yağ", "bitkisel", "diğer"];

  return (
    <>
      <Input
        placeholder="Ürün ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "all" ? "Tümü" : cat}
          </option>
        ))}
      </Select>
    </>
  );
}

