import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import { addMusic, getMusic } from "../controllers/musicController.js";
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./elokepek/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const router = express.Router();
router.post("/addMusic", validateToken, upload.single("image"), addMusic);
router.get("/getMusic", getMusic);
export default router;
