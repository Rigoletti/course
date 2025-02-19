// authController.mjs
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs"; 

// Регистрация пользователя
export const register = async (req, res) => {
  try {
    console.log("Incoming registration data:", req.body);

    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    const existingUserByEmail = await User.findOne({ email }).catch((err) => {
      console.error("Database error:", err);
      return null;
    });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" });
    }

    const existingUserByUsername = await User.findOne({ username }).catch((err) => {
      console.error("Database error:", err);
      return null;
    });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Пользователь с таким логином уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Регистрация успешна" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Авторизация пользователя
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Авторизация успешна", token });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};