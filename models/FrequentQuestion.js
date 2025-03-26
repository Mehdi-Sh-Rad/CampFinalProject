import mongoose from "mongoose";
const FrequentQuestionSchema = new mongoose.Schema({
   topic: {
      type: String,
      required: [true, "Please enter your comment"],
   },
   question: {
      type: String,
      required: [true, "Please enter your comment"],
   },
   answer: {
      type: String,
      required: [true, "Please enter your comment"],
   }
},
   { timeseries: true }
);

export default mongoose.models.FrequentQuestion || mongoose.model("FrequentQuestion", FrequentQuestionSchema);