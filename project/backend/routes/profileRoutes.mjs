import express from "express";
import { getProfile, updateProfile, uploadAvatar, updateBalance } from "../controllers/profileController.mjs";
import multerConfig from "../config/multerConfig.mjs";
import multer from "multer";

const router = express.Router();
const upload = multer();

// Получение профиля
router.get("/profile", getProfile);

// Обновление данных профиля
router.put("/profile", upload.none(), updateProfile);

// Загрузка аватарки
router.post("/upload-avatar", multerConfig.single("avatar"), uploadAvatar);

// Обновление баланса
router.put("/update-balance", updateBalance);

export default router;