import mongoose from "mongoose";
const TicketSchema = new mongoose.Schema({
   topic: {
      type: String,
      required: [true, "Please enter your ticket topic"],
   },
   order: {
      type: String,
   },
   message: [
      {
        text: String,
        sender: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
},
   { timeseries: true }
);

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);