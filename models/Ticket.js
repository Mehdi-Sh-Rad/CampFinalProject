import mongoose from "mongoose";
const TicketSchema = new mongoose.Schema({
   topic: {
      type: String,
      required: [true, "Please enter your ticket topic"],
      trim: true,
      maxlength: 100,
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
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
   { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);