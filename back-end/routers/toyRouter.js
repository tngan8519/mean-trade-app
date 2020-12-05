import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Toy from "../models/toyModel.js";
import expressAsyncHandler from "express-async-handler";
import { isLoggedIn, checkToyAuthor, upload } from "../utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const toyRouter = express.Router();

toyRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const toys = await Toy.find({});
    res.send(toys);
  })
);

toyRouter.post(
  "/",
  isLoggedIn,
  expressAsyncHandler(async (req, res) => {
    const toy = new Toy({
      name: req.body.name,
      imgSrc: req.body.imgSrc,
      rentPrice: req.body.rentPrice,
      salePrice: req.body.salePrice,
      author: req.user,
    });
    const createdToy = await toy.save();
    res.status(201).send({ message: "New toy created", toy: createdToy });
  })
);

toyRouter.post("/uploadImage", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

toyRouter.post("/deleteImage", (req, res) => {
  const imageName = req.body.fileName;

  try {
    fs.unlinkSync(`${__dirname.slice(0, __dirname.length - 17)}/${imageName}`);
    res.send({ message: "file deleted successfully" });
  } catch (error) {
    res.send({ message: `no file deleted` });
  }
});

toyRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    // .populate("author") because toySchema has field author
    const toy = await Toy.findById(req.params.id).populate("author");
    if (toy) {
      res.send(toy);
    } else {
      res.status(404).send({ message: "Toy not found" });
    }
  })
);

toyRouter.put(
  "/:id",
  isLoggedIn,
  checkToyAuthor,
  expressAsyncHandler(async (req, res) => {
    const toy = await Toy.findById(req.params.id);
    if (toy) {
      if (req.body.imgSrc) {
        toy.imgSrc = req.body.imgSrc;
      }
      toy.name = req.body.name;
      toy.rentPrice = req.body.rentPrice;
      toy.salePrice = req.body.salePrice;

      const updatedToy = await toy.save();
      res.send({ message: "Toy update", toy: updatedToy });
    } else {
      res.status(404).send({ message: "Toy not found" });
    }
  })
);

toyRouter.delete(
  "/:id",
  isLoggedIn,
  checkToyAuthor,
  expressAsyncHandler(async (req, res) => {
    const toy = await Toy.findById(req.params.id);
    if (toy) {
      await toy.deleteOne();
      res.send({ message: "Toy is deleted" });
    } else {
      res.status(404).send({ message: "Toy not found" });
    }
  })
);

export default toyRouter;
