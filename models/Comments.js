import mongoose from "mongoose";
const CommentsSchema = new mongoose.Schema({

   name: {
      type: String,
      required: [true, "user name type is required"],
      trim: true,
   },
   email: {
      type: String,
      required: [true, "Email type is required"],
      trim: true,
   },
   product: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product",
         required: true,
       },
   text: {
      type: String,
      required: [true, "Please enter your comment"],
   }
},
   { timeseries: true }
);

export default mongoose.models.Comments || mongoose.model("Comments", CommentsSchema);