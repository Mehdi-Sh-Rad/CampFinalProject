import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema({

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
   text: {
      type: String,
      required: [true, "Please enter your comment"],
   },
   status: {
      type: Boolean,
   }
},
   { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);