import express from "express";
import Lunawear from "../models/Lunawear.js";
import cloudinary from "../lib/cloudinary.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      categoryLabel,
      description,
      price,
      originalPrice,
      colors,
      sizes,
      rating,
      reviews,
      tag,
      releaseDate,
      featuredScore,
      pattern,
      image,
    } = req.body;

    if (
      !name ||
      !category ||
      !categoryLabel ||
      !description ||
      !price ||
      !colors ||
      !sizes ||
      !rating ||
      !reviews ||
      !releaseDate ||
      !featuredScore ||
      !pattern ||
      !image
    ) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const uploadReponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadReponse.secure_url;

    const newLunawear = new Lunawear({
      name,
      category,
      categoryLabel,
      description,
      price,
      originalPrice,
      colors,
      sizes,
      rating,
      reviews,
      tag,
      releaseDate,
      featuredScore,
      pattern,
      image: imageUrl,
    });

    await newLunawear.save();

    res.status(201).json({ msg: "Product created successfully", newLunawear });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const lunawears = await Lunawear.find().sort({ createAt: -1 });

    res.status(200).json({ lunawears });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
