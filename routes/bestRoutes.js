import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import {
  addBest,
  deleteBest,
  getBests,
  updateBest,
  bestOfArtists,
} from "../controllers/bestController.js";
const router = express.Router();

router.get("/getBests", getBests);
router.post("/addBest", validateToken, addBest);
router.delete("/deleteBest/:nev", validateToken, deleteBest);
router.put("/updateBest", validateToken, updateBest);
router.get("/bestofartists", bestOfArtists);
export default router;
