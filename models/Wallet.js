import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0
    },
    transactionHistory: [{
      amount: { type: Number, required: true },
      type: { type: String, trans: ['credit', 'debit'], required: true },
      date: { type: Date, default: Date.now }
    }],
    oder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
