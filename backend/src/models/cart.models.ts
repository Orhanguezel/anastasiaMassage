import { Schema, model, Types, Document, Model } from "mongoose";
import { IProduct } from "./product.models";

// 🔸 Tek bir sepet ürünü
export interface ICartItem {
  product: Types.ObjectId | IProduct;
  quantity: number;
  priceAtAddition: number;
  totalPriceAtAddition: number;
}

// 🔸 Sepetin kendisi
export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  status: "open" | "ordered" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    priceAtAddition: {
      type: Number,
      required: true,
    },
    totalPriceAtAddition: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["open", "ordered", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true }
);


const Cart: Model<ICart> = model<ICart>("Cart", cartSchema);
export default Cart;
