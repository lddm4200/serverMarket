import express from "express";
import Cart from "../models/Cart.js";
import jwt from "jsonwebtoken";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { item } = req.body;
    if (!item) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    const newCart = new Cart({
      item,
      user: req.user._id,
    });

    await newCart.save();

    res.status(201).json({ msg: "Cart created successfully", newCart });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", protectRoute, async (req, res) => {
  try {
    const carts = await Cart.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(carts);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
