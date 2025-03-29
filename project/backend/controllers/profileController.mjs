import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import multer from "multer";

const upload = multer();

// Получение профиля
export const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Нет доступа" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({
      message: "Добро пожаловать в ваш профиль!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        bio: user.bio, 
        createdAt: user.createdAt, 
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Нет доступа" });
  }
};
// Обновление данных профиля
export const updateProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Нет доступа" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { firstName, lastName, bio } = req.body;

    const updateData = { firstName, lastName, bio };
    
    // Если есть загруженный файл, добавляем его в обновление
    if (req.file) {
      updateData.avatar = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({
      message: "Данные профиля обновлены",
      user,
    });
  } catch (error) {
    console.error("Ошибка обновления профиля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Загрузка аватарки
export const uploadAvatar = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Нет доступа" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    console.log("Загруженный файл:", req.file); // Логируем загруженный файл

    if (!req.file) {
      return res.status(400).json({ message: "Файл не был загружен" });
    }

    // Обновляем аватар пользователя
    user.avatar = `http://localhost:5000/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      message: "Аватарка успешно загружена",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Ошибка при загрузке аватарки:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
// Обновление баланса
export const updateBalance = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Нет доступа" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { balance } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { balance },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({
      message: "Баланс обновлен",
      user,
    });
  } catch (error) {
    console.error("Ошибка при обновлении баланса:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};