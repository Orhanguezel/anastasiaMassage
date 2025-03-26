import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    }
  ],

  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
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

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
