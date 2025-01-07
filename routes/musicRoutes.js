import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import {
  addMusic,
  deleteMusic,
  getMusic,
  updateMusic,
} from "../controllers/musicController.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./elokepek");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const router = express.Router();
router.post("/addMusic", validateToken, upload.single("elokep"), addMusic);
router.get("/getMusic", getMusic);
router.delete("/deleteMusic/:id", validateToken, deleteMusic);
router.put("/updateMusic", validateToken, upload.single("elokep"), updateMusic);
export default router;
