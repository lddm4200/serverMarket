import express from "express";
import "dotenv/config";
import cors from "cors";
import job from "./lib/cron.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRouter.js";
import { connectDB } from "./lib/db.js";

const app = express();

const PORT = process.env.PORT || 3000;

// Bắt đầu cron job
job.start();

// Cấu hình middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Giới hạn kích thước JSON
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Giới hạn kích thước URL-encoded

// Định nghĩa các route
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

// Trang 404
app.use((req, res) => {
  res.status(404).send("404 Not Found: Trang không tồn tại.");
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});