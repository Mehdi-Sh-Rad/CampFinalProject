import mongoose from "mongoose";
const TicketSchema = new mongoose.Schema({
   topic: {
      type: String,
      required: [true, "Please enter your ticket topic"],
   },
   order: {
      type: String,
   },
   problem: {
      type: String,
      required: [true, "Please enter your question"],
   },
   answer: {
      type: String,
      required: [true, "Please enter the anwser"],
   }
},
   { timeseries: true }
);

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);