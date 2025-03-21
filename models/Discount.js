import mongoose from "mongoose";

const DiscountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Discount code is required"],
      trim: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true, 
    }
  },
  { timestamps: true }
);

export default mongoose.models.Discount ||
  mongoose.model("Discount", DiscountSchema);