import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./database/Database.js"; // Fixed path
import transactionRoutes from "./routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

// Initialize Express
const app = express();
const port = process.env.PORT || 4000; // Use environment variable if available

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// Health Check Endpoint
app.get("/", (req, res) => {
  res.send("✅ FinManager Server is Running!");
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
