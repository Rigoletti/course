import express from "express";
import { getProfile, updateProfile, uploadAvatar } from "../controllers/profileController.mjs";
import multerConfig from "../config/multerConfig.mjs";
import multer from "multer"; // Импортируем multer

const router = express.Router();

// Создаем middleware для обработки текстовых данных
const upload = multer();

// Получение профиля
router.get("/profile", getProfile);

// Обновление данных профиля
router.put("/profile", upload.none(), updateProfile); // Используем upload.none() для текстовых данных

// Загрузка аватарки
router.post("/upload-avatar", multerConfig.single("avatar"), uploadAvatar);

export default router;