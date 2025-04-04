import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
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
    ],
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

export default model("Cart", cartSchema);
