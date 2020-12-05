import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import Toy from "./models/toyModel.js";
import multer from "multer";
import path from "path";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET || "somethingsecret",
    { expiresIn: "30d" }
  );
};

// middleware

// check authentication
export const isLoggedIn = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid Token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

// check Toy Author
export const checkToyAuthor = expressAsyncHandler(async (req, res, next) => {
  const toy = await Toy.findById(req.params.id);
  if (toy.author.equals(req.user._id)) {
    next();
  } else {
    res.status(401).send({ message: "You do not have permission to do that!" });
  }
});

// upload
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    const filetypes = /jpeg|jpg|png|gif/;
    if (filetypes.test(ext) && filetypes.test(mimetype)) {
      cb(null, true);
    } else {
      cb(res.status(400).end("only jpg, png are allowed"), false);
    }
  },
});

export const upload = multer({ storage: storage }).single("file");
