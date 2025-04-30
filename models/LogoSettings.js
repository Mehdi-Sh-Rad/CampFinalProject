import mongoose from "mongoose";

const LogoSettingsSchema = new mongoose.Schema(
  {
    headerLogo: { type: String, default: "/PersianLogo.png" }, 
  },
  { timestamps: true }
);

export default mongoose.models.LogoSettings || mongoose.model("LogoSettings", LogoSettingsSchema);