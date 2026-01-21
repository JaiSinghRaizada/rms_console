import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// 🔹 MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 🔹 ROOT TEST ROUTE (ADD IT HERE ✅)
app.get("/", (req, res) => {
  res.send("Backend root working");
});

// 🔹 API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// 🔹 DATABASE + SERVER START
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
