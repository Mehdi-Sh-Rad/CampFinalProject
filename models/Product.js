import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: [true, "Product file is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Product image is required"]
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"]
    },
    // tag: {
    //   type: String,
    //   required: [true, "Product tag is required"]
    // },
    // fileType: {
    //   type: String,
    //   required: [true, "Product file type is required"]
    // },
    active: {
      type: Boolean,
      required: [true, "Product is active or not, is required"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"]
    },
    discountPrice: {
      type: String,
      required: false, 
    },
    isFree: {
      type: Boolean,
      required: false,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
