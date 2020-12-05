import mongoose from "mongoose";

const toySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    rentPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    imgSrc: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Toy = mongoose.model("Toy", toySchema);

export default Toy;
