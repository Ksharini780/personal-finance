import express from "express";
import {
  addTransactionController,
  getAllTransactionController,
  getSingleTransactionController,
  updateTransactionController,
  deleteTransactionController,
  deleteMultipleTransactionsController,
} from "../controllers/transactionController.js";

const router = express.Router();

// ✅ Add a new transaction
router.post("/addTransaction", addTransactionController);

// ✅ Get all transactions (with filters)
router.post("/getTransaction", getAllTransactionController);

// ✅ Get a single transaction by ID
router.get("/transaction/:id", getSingleTransactionController);

// ✅ Update a transaction
router.put("/updateTransaction/:id", updateTransactionController);

// ✅ Delete a single transaction
router.delete("/deleteTransaction/:id", deleteTransactionController);

// ✅ Delete multiple transactions
router.post("/deleteMultiple", deleteMultipleTransactionsController);

export default router;
