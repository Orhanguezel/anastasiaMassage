"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api";
import { useParams } from "next/navigation";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    axios.get(`/blogs/${slug}`).then((res) => setBlog(res.data));
  }, [slug]);

  if (!blog) return <p>Yükleniyor...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "1rem" }}>
      <img
        src={blog.image}
        alt={blog.title}
        style={{ width: "100%", borderRadius: 8 }}
      />
      <h1>{blog.title}</h1>
      <p>
        <em>
          {blog.category} • {blog.author}
        </em>
      </p>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
}
