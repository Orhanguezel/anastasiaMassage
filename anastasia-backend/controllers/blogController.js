import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

// ✅ Blog Ekle
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, category, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Başlık ve içerik zorunludur." });
  }

  const slug = slugify(title, { lower: true });

  const image = req.file
    ? `${process.env.BASE_URL}/uploads/blog-images/${req.file.filename}`
    : "https://via.placeholder.com/600x400";

  const blog = await Blog.create({ title, content, slug, category, author, image });

  res.status(201).json({ message: "✅ Blog eklendi", blog });
});

// ✅ Blogları Listele
export const getAllBlogs = asyncHandler(async (req, res) => {
  const category = req.query.category;
  const filter = category ? { category } : {};

  const blogs = await Blog.find(filter).sort({ createdAt: -1 });
  res.json(blogs);
});

// ✅ Blog Detayı (slug ile)
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    return res.status(404).json({ message: "Blog bulunamadı" });
  }
  res.json(blog);
});

// ✅ Blog Güncelle
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });

  const { title, content, category, author } = req.body;

  blog.title = title || blog.title;
  blog.slug = title ? slugify(title, { lower: true }) : blog.slug;
  blog.content = content || blog.content;
  blog.category = category || blog.category;
  blog.author = author || blog.author;

  if (req.file) {
    blog.image = `${process.env.BASE_URL}/uploads/blog-images/${req.file.filename}`;
  }

  await blog.save();

  res.json({ message: "✅ Blog güncellendi", blog });
});

// ✅ Blog Sil
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });

  res.json({ message: "🗑️ Blog silindi" });
});
