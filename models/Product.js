import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Product author is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    fileUrls: {
      type: [String],
      required: true,
    },
    types: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    free: {
      type: Boolean,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
    },
    award: {
      type: Boolean,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
