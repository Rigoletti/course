import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

// Валидация логина (латиница)
const validateLogin = (username) => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(username);
};

// Валидация имени и фамилии (кириллица или латиница)
const validateName = (name) => {
  const regex = /^[a-zA-Zа-яА-Я]+$/;
  return regex.test(name);
};

// Валидация пароля
const validatePassword = (password) => {
  const regex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
  return regex.test(password);
};

// Функция для генерации токена
const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, role } = req.body;

    // Валидация данных
    if (!validateName(firstName) || !validateName(lastName)) {
      return res.status(400).json({ message: "Имя и фамилия должны содержать только буквы (кириллица или латиница)." });
    }
    if (!validateLogin(username)) {
      return res.status(400).json({ message: "Логин должен содержать только латинские буквы и цифры." });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Пароль должен быть минимум 8 символов, содержать хотя бы одну цифру и одну заглавную букву." });
    }

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создание пользователя
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword, // Сохраняем хешированный пароль
      role: role || "user",
    });

    await user.save();
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Сравнение пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    // Генерация токена
    const token = generateToken(user);

    res.json({ token, user });
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};