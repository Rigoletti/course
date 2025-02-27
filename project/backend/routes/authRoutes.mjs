import express from "express";
import * as authController from "../controllers/authController.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs"; // Импортируем middleware

const router = express.Router();

// Регистрация
router.post("/register", authController.register);

// Вход
router.post("/login", authController.login);

// Получение профиля (требуется аутентификация)
router.get("/profile", authMiddleware, authController.getProfile);

// Обновление профиля (требуется аутентификация)
router.put("/profile", authMiddleware, authController.updateProfile);

// GitHub Auth
router.get("/github", authController.githubAuth);

// GitHub Callback
router.get("/github/callback", authController.githubCallback);

export default router;