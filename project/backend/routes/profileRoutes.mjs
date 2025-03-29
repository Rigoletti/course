import express from "express";
import { getProfile, updateProfile, uploadAvatar, updateBalance } from "../controllers/profileController.mjs";
import upload from "../config/multerConfig.mjs"; // Используем один экземпляр

const router = express.Router();

// Получение профиля
router.get("/", getProfile);

// Обновление данных профиля
router.put("/", upload.single("avatar"), updateProfile);

// Обновление баланса
router.put("/update-balance", updateBalance);

export default router;