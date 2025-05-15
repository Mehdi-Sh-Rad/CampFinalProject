import mongoose from "mongoose";

const SiteSettingSchema = new mongoose.Schema(
  {
    slogan: {
      type: String,
      required: true,
      default: "جهان کتاب، در دستان شما",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSetting || mongoose.model("SiteSetting", SiteSettingSchema);