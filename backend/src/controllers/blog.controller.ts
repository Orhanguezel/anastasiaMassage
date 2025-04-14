import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import Blog, { IBlog } from "../models/blog.models";
import { isValidObjectId } from "../utils/validation";

// ✅ Blog oluştur
export const createBlog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, content, category, author }: Partial<IBlog> = req.body;

  if (!title || !content) {
    res.status(400).json({ message: "Title and content are required." });
    return;
  }

  const slug = slugify(title, { lower: true });
  const image = req.file
    ? `${process.env.BASE_URL}/uploads/blog-images/${req.file.filename}`
    : "https://via.placeholder.com/600x400";

  const blog = await Blog.create({
    title,
    content,
    category,
    author,
    slug,
    image,
  });

  res.status(201).json({
    message: "Blog created successfully",
    blog,
  });
});

// ✅ Tüm blogları getir (isteğe bağlı kategori filtresi)
export const getAllBlogs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { category } = req.query;
  const filter = category ? { category } : {};

  const blogs = await Blog.find(filter).sort({ createdAt: -1 });
  res.status(200).json(blogs);
});

// ✅ Slug ile blog getir
export const getBlogBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug });
  if (!blog) {
    res.status(404).json({ message: "Blog not found" });
    return;
  }

  res.status(200).json(blog);
});

// ✅ Blog güncelle
export const updateBlog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content, category, author }: Partial<IBlog> = req.body;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid blog ID" });
    return;
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(404).json({ message: "Blog not found" });
    return;
  }

  blog.title = title ?? blog.title;
  blog.slug = title ? slugify(title, { lower: true }) : blog.slug;
  blog.content = content ?? blog.content;
  blog.category = category ?? blog.category;
  blog.author = author ?? blog.author;

  if (req.file) {
    blog.image = `${process.env.BASE_URL}/uploads/blog-images/${req.file.filename}`;
  }

  await blog.save();

  res.status(200).json({
    message: "Blog updated successfully",
    blog,
  });
});

// ✅ Blog sil
export const deleteBlog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid blog ID" });
    return;
  }

  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    res.status(404).json({ message: "Blog not found" });
    return;
  }

  res.status(200).json({ message: "Blog deleted successfully" });
});
