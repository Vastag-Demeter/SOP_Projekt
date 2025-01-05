import express from "express";
import { register } from "../controllers/userController.js";
import pool from "../database/database.js";
const router = express.Router();

router.post("/register", register);
export default router;
