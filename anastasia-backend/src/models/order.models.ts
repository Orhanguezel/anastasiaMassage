// src/models/order.models.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  user?: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalPrice: number;
  paymentMethod: "cash_on_delivery";
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery"],
      default: "cash_on_delivery",
    },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export default model<IOrder>("Order", orderSchema);