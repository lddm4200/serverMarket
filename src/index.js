import express from "express";
import "dotenv/config";
import cors from "cors";
import job from "./lib/cron.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRouter.js";

import { connectDB } from "./lib/db.js";

const app = express();
// app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

job.start();
app.use(express.json());
app.use(cors());

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

// Trang 404
app.use((req, res) => {
  res.status(404).send("404 Not Found: Trang không tồn tại.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
