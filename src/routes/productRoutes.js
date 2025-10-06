import express from "express";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, image, price, rating } = req.body;

    if (!title || !caption || !image || !price) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    if (isNaN(price)) {
      return res.status(400).json({ msg: "Price and rating must be numbers" });
    }

    const uploadReponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadReponse.secure_url;

    const newProduct = new Product({
      title,
      caption,
      image: imageUrl,
      price: parseFloat(price),
      rating: parseFloat(rating),
      user: req.user._id,
    });

    await newProduct.save();

    res.status(201).json({ msg: "Product created successfully", newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");
    const totalPrrroduct = await Product.countDocuments();
    res.send({
      products,
      currentPage: page,
      totalPrrroduct,
      totalPages: Math.ceil(totalPrrroduct / limit),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/productDetail/:id", protectRoute, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.send({ product });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/user", protectRoute, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    if (product.image && product.image.includes("cloudinary")) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from Cloudinary:", deleteError);
      }
    }

    await product.deleteOne();
    res.json({ msg: "Product removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", protectRoute, async (req, res) => {
  try {
    const { title, caption, image, price, rating } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Kiểm tra quyền sửa
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Nếu có ảnh mới thì upload lên cloudinary
    let imageUrl = product.image;
    if (image && image !== product.image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Cập nhật thông tin
    product.title = title || product.title;
    product.caption = caption || product.caption;
    product.image = imageUrl;
    product.price = price !== undefined ? parseFloat(price) : product.price;
    product.rating = rating !== undefined ? parseFloat(rating) : product.rating;

    await product.save();

    res.json({ msg: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
