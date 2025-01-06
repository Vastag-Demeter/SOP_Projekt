import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import {
  addMusic,
  bestOfArtists,
  deleteMusic,
  getMusic,
  updateMusic,
} from "../controllers/musicController.js";

const router = express.Router();
router.post("/addMusic", validateToken, addMusic);
router.get("/getMusic", getMusic);
router.delete("/deleteMusic", validateToken, deleteMusic);
router.put("/updateMusic", validateToken, updateMusic);
router.get("/bestOfArtists", bestOfArtists);
export default router;
