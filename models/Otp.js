import mongoose from "mongoose";
const OtpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    kind: {
      type: Number,
      required: true,
      default: 1,
      comment: "1 for register , 2 for login",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
