import express from "express";
import * as authController from "../controllers/authController.mjs";
import { checkUserRole } from "../controllers/authController.mjs";
import { authMiddleware } from "../middleware/authMiddleware.mjs"; 

const router = express.Router();

// Регистрация
router.post("/register", authController.register);

// Вход
router.post("/login", authController.login);

// Проверка роли
router.get("/check-role", authMiddleware, checkUserRole);

router.post("/complete-github-registration", authMiddleware, authController.completeGithubRegistration);

// Выход
router.post("/logout", authController.logout); 

export default router;