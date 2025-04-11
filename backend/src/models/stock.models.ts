// src/models/stock.models.ts
import { Schema, model, Types, Document } from "mongoose";

export interface IStock extends Document {
  product: Types.ObjectId; 
  quantity: number;       
  updatedAt: Date;
}

const stockSchema = new Schema<IStock>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true }, 
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<IStock>("Stock", stockSchema);
