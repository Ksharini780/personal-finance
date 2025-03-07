import Transaction from "../models/TransactionModel.js";

// Add a new transaction
export const addTransaction = async (req, res) => {
  try {
    const { userId, type, amount, category, description, date } = req.body;

    if (!userId || !type || !amount || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTransaction = new Transaction({ userId, type, amount, category, description, date });
    await newTransaction.save();

    res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all transactions for a specific user & calculate totals
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching transactions for user:", userId); // ✅ Debugging log

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    // Calculate Total Income, Expenses, and Balance
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    console.log("Fetched Transactions:", transactions); // ✅ Log transactions

    res.status(200).json({
      transactions,
      totalIncome,
      totalExpense,
      totalBalance,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    await Transaction.findByIdAndDelete(transactionId);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
