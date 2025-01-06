import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import {
  addMusic,
  deleteMusic,
  getMusic,
  updateMusic,
} from "../controllers/musicController.js";
import { validateHeaderValue } from "http";

const router = express.Router();
router.post("/addMusic", validateToken, addMusic);
router.get("/getMusic", getMusic);
router.delete("/deleteMusic", validateToken, deleteMusic);
router.put("/updateMusic", validateToken, updateMusic);
export default router;
