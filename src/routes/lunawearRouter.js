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

router.put("/:id", async (req, res) => {
  try {
    const lunawear = await Lunawear.findById(req.params.id);
    if (!lunawear) {
      return res.status(404).json({ msg: "Product not found" });
    }

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

    let imageUrl = lunawear.image;
    if (image !== lunawear.image) {
      const uploadReponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadReponse.secure_url;
    }

    lunawear.name = name;
    lunawear.category = category;
    lunawear.categoryLabel = categoryLabel;
    lunawear.description = description;
    lunawear.price = price;
    lunawear.originalPrice = originalPrice;
    lunawear.colors = colors;
    lunawear.sizes = sizes;
    lunawear.rating = rating;
    lunawear.reviews = reviews;
    lunawear.tag = tag;
    lunawear.releaseDate = releaseDate;
    lunawear.featuredScore = featuredScore;
    lunawear.pattern = pattern;
    lunawear.image = imageUrl;
    await lunawear.save();

    res.status(200).json({ msg: "Product updated successfully", lunawear });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const lunawear = await Lunawear.findById(req.params.id);
    if (!lunawear) {
      return res.status(404).json({ msg: "Product not found" });
    }

    await lunawear.deleteOne();

    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lunawear = await Lunawear.findById(req.params.id);
    if (!lunawear) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json({ lunawear });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
