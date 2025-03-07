import express from "express";
import { addTransaction, getTransactions, deleteTransaction } from "../controllers/transactionController.js";

const transactionRoutes = express.Router();

// Transaction routes
transactionRoutes.post("/add", addTransaction);
transactionRoutes.get("/user/:userId", getTransactions);  // Updated route for clarity
transactionRoutes.delete("/:transactionId", deleteTransaction);

export default transactionRoutes;
