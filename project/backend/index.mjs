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
import categoryRoutes from "./routes/categoryRoutes.mjs";
import orderRoutes from './routes/orderRoutes.mjs';
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Создание папки uploads, если она не существует
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Папка uploads создана");
}

// Подключение middleware
app.use(configureCors());
app.use(express.json());
app.use(cookieParser());
app.use(configureSession());

// Раздача статических файлов
app.use("/uploads", express.static(uploadsDir));

// Подключение к базе данных
connectDB();

// Настройка Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Маршруты
app.use("/api/auth", authRoutes); // Только для аутентификации
app.use("/api/profile", profileRoutes); // Отдельный путь для профиля
app.use("/api/auth/github", githubRoutes); // GitHub аутентификация
app.use("/api/categories", categoryRoutes);
app.use('/api/orders', orderRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});