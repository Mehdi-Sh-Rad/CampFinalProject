import mongoose from "mongoose";
const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: null,
      required: false,
    },
    phone: {
      type: String,
      default: null,
      required: false,
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
    method: {
      type: String,
      enum: ["phone", "email"],
      default: "phone",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
