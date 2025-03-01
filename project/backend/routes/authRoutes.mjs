import express from "express";
import * as authController from "../controllers/authController.mjs";

const router = express.Router();

// Регистрация
router.post("/register", authController.register);

// Вход
router.post("/login", authController.login);

export default router;