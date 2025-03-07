import express from "express";
import connectDB from "./database/Database.js";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./Routers/userRouter.js";
import transactionRoutes from "./Routers/Transactions.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRoutes);


// Connect to MongoDB
connectDB();

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


