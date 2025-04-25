import mongoose from "mongoose";
const ProductQuestionSchema = new mongoose.Schema({

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
   question: {
      type: String,
      required: [true, "Please enter your comment"],
   },
   answer: {
      type: String,
   },
},
   { timestamps: true }
);

export default mongoose.models.ProductQuestion || mongoose.model("ProductQuestion", ProductQuestionSchema);