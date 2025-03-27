"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styled from "styled-components";
import BlogForm from "@/components/admin/BlogForm";

const Table = styled.table`
  width: 100%;
  background: #fff;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  background: #eee;
  padding: 10px;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button<{ color?: string }>`
  margin-right: 6px;
  padding: 6px 10px;
  background-color: ${({ color }) => color || "#2980b9"};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);

  const fetchData = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>📰 Blog Yazıları</h1>

      <BlogForm blog={editBlog} onSuccess={() => {
        fetchData();
        setEditBlog(null);
      }} />

      <Table>
        <thead>
          <tr>
            <Th>Başlık</Th>
            <Th>Kategori</Th>
            <Th>Yazar</Th>
            <Th>Durum</Th>
            <Th>İşlem</Th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((b: any) => (
            <tr key={b._id}>
              <Td>{b.title}</Td>
              <Td>{b.category}</Td>
              <Td>{b.author}</Td>
              <Td>{b.isPublished ? "✅ Yayında" : "⏳ Taslak"}</Td>
              <Td>
                <Button onClick={() => setEditBlog(b)}>Düzenle</Button>
                <Button color="#e74c3c" onClick={() => handleDelete(b._id)}>Sil</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
