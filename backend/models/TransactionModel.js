import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be a positive number"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  transactionType: {
    type: String,
    required: [true, "Transaction Type is required"],
    enum: ["income", "expense"], // Ensures valid values
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
