import { Schema, model, Document } from "mongoose";

export interface IGalleryItem extends Document {
  title?: string;
  image: string;
  type: "image" | "video";
  createdAt?: Date;
}

const gallerySchema = new Schema<IGalleryItem>(
  {
    title: { type: String },
    image: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
  },
  { timestamps: true }
);

export default model<IGalleryItem>("Gallery", gallerySchema);
