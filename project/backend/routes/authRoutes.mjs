import { register, login, getUserProfile } from "../controllers/authController.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs"; 
import express from "express";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile); // Защищенный маршрут

export default router;