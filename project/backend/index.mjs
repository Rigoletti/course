import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db_connect.mjs";
import passport from "passport";
import configurePassport from "./config/passportConfig.mjs";
import configureSession from "./config/sessionConfig.mjs";
import configureCors from "./config/corsConfig.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import profileRoutes from "./routes/profileRoutes.mjs";
import githubRoutes from "./routes/githubRoutes.mjs";
import multerConfig from "./config/multerConfig.mjs";
import { uploadAvatar } from "./controllers/profileController.mjs";
import categoryRoutes from "./routes/categoryRoutes.mjs"; 
import path from "path";
import fs from "fs";
// services
import webRoutes from './routes/services/webRoutes.mjs';



dotenv.config();
const app = express();
const uploadsDir = path.join(process.cwd(), "uploads");

// Создание папки uploads, если она не существует
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Папка uploads создана");
}

// Раздача статических файлов
app.use("/uploads", express.static(uploadsDir));

// Подключение middleware
app.use(configureCors());
app.use(express.json());
app.use(configureSession());

// Подключение к базе данных
connectDB();

// Настройка Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Маршруты
app.use("/api/auth", authRoutes);
app.use("/api/auth", profileRoutes);
app.use("/api/auth", githubRoutes);
app.use("/api/categories", categoryRoutes); 
app.use('/api/orders', webRoutes);
// Маршрут для загрузки аватарки
app.post("/api/auth/upload-avatar", multerConfig.single("avatar"), uploadAvatar);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});