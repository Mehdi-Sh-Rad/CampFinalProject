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
    newEmail: {
      type: String,
      default: null,
      required: false,
    },
    newPhone: {
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
      enum: ["phone", "email", "reset-password", "change-email", "change-phone"],
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
