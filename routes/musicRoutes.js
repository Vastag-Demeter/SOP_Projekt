import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import {
  addMusic,
  deleteMusic,
  getMusic,
  updateMusic,
} from "../controllers/musicController.js";

const router = express.Router();
router.post("/addMusic", validateToken, addMusic);
router.get("/getMusic", getMusic);
router.delete("/deleteMusic/:id", validateToken, deleteMusic);
router.put("/updateMusic", validateToken, updateMusic);
export default router;
