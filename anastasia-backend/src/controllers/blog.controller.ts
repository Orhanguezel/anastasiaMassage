// src/controllers/blog.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import Blog from "../models/blog.models";

// Create Blog
export const createBlog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, content, category, author } = req.body;

  if (!title || !content) {
    res.status(400).json({ message: "Title and content are required." });
    return;
  }

  const slug = slugify(title, { lower: true });
  const image = req.file
    ? `${process.env.BASE_URL}/uploads/blog-images/${req.file.filename}`
    : "https://via.placeholder.com/600x400";

  const blog = await Blog.create({ title, content, slug, category, author, image });
  res.status(201).json({ message: "Blog created successfully", blog });
});

// Get All Blogs
export const getAllBlogs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const category = req.query.category;
  const filter = category ? { category } : {};

  const blogs = await Blog.find(filter).sort({ createdAt: -1 });
  res.json(blogs);
});

// Get Blog By Slug
export const getBlogBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    res.status(404).json({ message: "Blog not found" });
    return;
  }
  res.json(blog);
});

// Update Blog
export const updateBlog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404).json({ message: "Blog not found" });
    return;
  }

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
  res.json({ message: "Blog updated successfully", blog });
});

// Delete Blog
export const deleteBlog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    res.status(404).json({ message: "Blog not found" });
    return;
  }
  res.json({ message: "Blog deleted successfully" });
});
