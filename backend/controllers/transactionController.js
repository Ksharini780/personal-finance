import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

// ✅ Add Transaction
export const addTransactionController = async (req, res) => {
  try {
    const { title, amount, description, date, category, userId, transactionType } = req.body;

    if (!title || !amount || !description || !date || !category || !transactionType) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newTransaction = await Transaction.create({ title, amount, category, description, date, user: userId, transactionType });

    user.transactions.push(newTransaction._id);
    await user.save();

    return res.status(201).json({ success: true, message: "Transaction added successfully", transaction: newTransaction });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get All Transactions with Filters
export const getAllTransactionController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let query = { user: userId };
    if (type !== "all") query.transactionType = type;

    if (frequency !== "custom") {
      query.date = { $gt: moment().subtract(Number(frequency), "days").toDate() };
    } else if (startDate && endDate) {
      query.date = { $gte: moment(startDate).toDate(), $lte: moment(endDate).toDate() };
    }

    const transactions = await Transaction.find(query);
    return res.status(200).json({ success: true, transactions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Fetch Single Transaction
export const getSingleTransactionController = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    return res.status(200).json({ success: true, transaction });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete Transaction
export const deleteTransactionController = async (req, res) => {
  try {
    const { userId } = req.body;
    const transactionId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const transaction = await Transaction.findByIdAndDelete(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    user.transactions = user.transactions.filter(txn => txn.toString() !== transactionId);
    await user.save();

    return res.status(200).json({ success: true, message: "Transaction successfully deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Multi-Delete Transactions
export const deleteMultipleTransactionsController = async (req, res) => {
  try {
    const { userId, transactionIds } = req.body;

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid transaction IDs" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await Transaction.deleteMany({ _id: { $in: transactionIds } });

    user.transactions = user.transactions.filter(txn => !transactionIds.includes(txn.toString()));
    await user.save();

    return res.status(200).json({ success: true, message: "Transactions deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update Transaction
export const updateTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const updates = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    Object.keys(updates).forEach(key => {
      transaction[key] = updates[key];
    });

    await transaction.save();

    return res.status(200).json({ success: true, message: "Transaction updated successfully", transaction });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
