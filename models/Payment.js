import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: [true, "Discount code is required"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);