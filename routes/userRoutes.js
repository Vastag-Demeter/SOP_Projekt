import express from "express";
import { login, logout, register } from "../controllers/userController.js";
import { validateToken } from "../middleware/validateTokenHandler.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", validateToken, logout);
export default router;
