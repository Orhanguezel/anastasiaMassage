"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "@/lib/api";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
`;

const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
`;

const Title = styled.h4`
  margin: 0.8rem 0 0.4rem;
`;

const Filter = styled.select`
  margin-bottom: 1rem;
  padding: 0.5rem;
`;

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState("");

  const fetchBlogs = () => {
    axios
      .get(`/blogs${category ? `?category=${category}` : ""}`)
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBlogs();
  }, [category]);

  return (
    <Container>
      <h1>📰 Blog</h1>

      <Filter onChange={(e) => setCategory(e.target.value)} value={category}>
        <option value="">Tümü</option>
        <option value="beslenme">Sağlıklı Beslenme</option>
        <option value="vegan">Vegan</option>
        <option value="parazit">Parazit Temizliği</option>
      </Filter>

      <Grid>
        {blogs.map((b: any) => (
          <Card key={b._id}>
            <Image src={b.image} alt={b.title} />
            <Title>{b.title}</Title>
            <p style={{ fontSize: "0.9rem" }}>{b.category}</p>
            <Link href={`/visitor/blogs/${b.slug}`}>Devamını Oku →</Link>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
