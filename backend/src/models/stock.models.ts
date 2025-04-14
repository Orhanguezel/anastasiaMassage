import { Schema, model, Types, Document, Model } from "mongoose";

export interface IStock extends Document {
  product: Types.ObjectId;
  quantity: number;
  type: "initial" | "manual" | "restock" | "sale";
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const stockSchema: Schema<IStock> = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["initial", "manual", "restock", "sale"],
      required: true,
    },
    
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Stock: Model<IStock> = model<IStock>("Stock", stockSchema);
export default Stock;
