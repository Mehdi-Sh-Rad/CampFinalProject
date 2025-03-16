import mongoose from "mongoose";
const CommentsSchema = new mongoose.Schema({
   name: {
    type: String,
    required: [true,"Comment type is required"],
    trim: true,
   },
},
{timeseries: true}
);

export default mongoose.model.Comments || mongoose.model("Comments", CommentsSchema);