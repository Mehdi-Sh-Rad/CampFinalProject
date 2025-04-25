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
    items: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
              default: 1,
              min: 1,
            },
          },
        ],
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