import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import bloodRequestRoutes from "./routes/bloodRequestRoutes.js";
import donorResponseRoutes from "./routes/donorResponseRoutes.js";

// Load environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect database
connectDB();

// Middleware to enable cors and parse json
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/donor-responses", donorResponseRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});