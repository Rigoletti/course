import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import passport from "passport";

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

export const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

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
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Пользователь с таким логином уже существует" });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    // Сохранение пользователя в базе данных
    await newUser.save();

    // Успешный ответ
    res.status(201).json({ message: "Регистрация успешна" });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем, что email и password переданы
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    // Ищем пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    // Сравниваем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Отправляем успешный ответ
    res.status(200).json({ message: "Авторизация успешна", token });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getProfile = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  res.json({
    message: "Добро пожаловать в ваш профиль!",
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    },
  });
};


export const githubAuth = passport.authenticate("github", { scope: ["user:email"] });
export const githubCallback = (req, res, next) => {
  passport.authenticate("github", { failureRedirect: "/login" }, (err, user, info) => {
    if (err) {
      console.error("Ошибка при авторизации через GitHub:", err);
      return res.redirect("/login");
    }
    if (!user) {
      console.error("Пользователь не найден:", info);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Ошибка при входе:", err);
        return res.redirect("/login");
      }

      console.log("Пользователь авторизован:", user);
      return res.redirect("http://localhost:5000/api/auth/profile");
    });
  })(req, res, next);
};