import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import {
  addBest,
  deleteBest,
  getBests,
  updateBest,
} from "../controllers/bestController.js";
const router = express.Router();

router.get("/getBests", getBests);
router.post("/addBest", validateToken, addBest);
router.delete("/deleteBest", validateToken, deleteBest);
router.put("/updateBest", validateToken, updateBest);
export default router;
