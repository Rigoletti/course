import express from "express";
import { getProfile, updateProfile, uploadAvatar } from "../controllers/profileController.mjs";
import multerConfig from "../config/multerConfig.mjs";

const router = express.Router();

// Получение профиля
router.get("/profile", getProfile);

// Обновление данных профиля
router.put("/profile", updateProfile);

// Загрузка аватарки
router.post("/upload-avatar", multerConfig.single("avatar"), uploadAvatar);

export default router;