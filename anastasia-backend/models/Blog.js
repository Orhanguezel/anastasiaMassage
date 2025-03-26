import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  image: { type: String, default: "https://via.placeholder.com/600x400" },
  category: {
    type: String,
    enum: ["beslenme", "parazit", "vegan", "genel"],
    default: "genel",
  },
  author: { type: String, default: "Anastasia König" },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);
