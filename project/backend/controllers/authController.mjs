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
    const { firstName, lastName, username, email, password, confirmPassword, role } = req.body;

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Пароли не совпадают" });
    }

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
      password: hashedPassword, 
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    res.json({ token, user }); 
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const logout = async (req, res) => {
  try {
    // Удаляем куку с токеном
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ message: 'Выход выполнен успешно' });
  } catch (error) {
    console.error('Ошибка при выходе:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const checkUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('role');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({ role: user.role });
  } catch (error) {
    console.error('Ошибка при проверке роли:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const completeGithubRegistration = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { firstName, lastName, email } = req.body;

    // Validate input
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        firstName,
        lastName,
        email,
        needsCompletion: false 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new token without needsCompletion flag
    const newToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ 
      success: true,
      message: "Registration completed",
      token: newToken,
      user 
    });

  } catch (error) {
    console.error("Complete registration error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};