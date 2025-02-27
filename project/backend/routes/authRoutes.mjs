import express from "express";
import * as authController from "../controllers/authController.mjs";

const router = express.Router();

// Регистрация
router.post("/register", authController.register);

// Вход
router.post("/login", authController.login);

// Получение профиля
router.get("/profile", authController.getProfile);

// GitHub Auth
router.get("/github", authController.githubAuth);

// GitHub Callback
router.get("/github/callback", authController.githubCallback);

export default router;