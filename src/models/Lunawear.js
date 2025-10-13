import mongoose from "mongoose";

const lunawearSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    categoryLabel: {
      type: String,
      required: true,
    },
    description:
     {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number || null,
    },
    colors: {
      type: Array,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    reviews: {
      type: Number,
      required: true,
    },
    tag: {
      type: String || null,
    },
    releaseDate: {
      type: String,
      required: true,
    },
    featuredScore: {
      type: Number,
      required: true,
    },
    pattern: {
      type: String,
      required: true,
    },
    image:{
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Lunawear = mongoose.model("Lunawear", lunawearSchema);
export default Lunawear;
