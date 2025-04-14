import { Schema, model, Document } from "mongoose";

// Blog kategorileri (Almanca)
export type BlogCategory = "ernaehrung" | "parasiten" | "vegan" | "allgemein";

// Blog interface
export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  image: string;
  category: BlogCategory;
  author: string;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: {
      type: String,
      default: "https://via.placeholder.com/600x400",
    },
    category: {
      type: String,
      enum: ["ernaehrung", "parasiten", "vegan", "allgemein"],
      default: "allgemein",
    },
    author: {
      type: String,
      default: "Anastasia König",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default model<IBlog>("Blog", blogSchema);
