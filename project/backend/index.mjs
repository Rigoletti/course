import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db_connect.mjs";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import session from "express-session";
import User from "./models/User.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

const app = express();

// Настройка CORS
app.use(cors({
  origin: "http://localhost:5173", // Разрешаем запросы с фронтенда
  credentials: true, // Разрешаем передачу кук
}));

app.use(express.json());

// Настройка сессии
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Установите secure: true, если используете HTTPS
  })
);

// Подключение к базе данных
connectDB();

// Настройка стратегии GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GitHub Profile:", profile); // Логируем профиль для отладки

        // Проверяем, существует ли пользователь с таким GitHub ID
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // Если пользователь не существует, создаем нового
          const displayName = profile.displayName || "Unknown User";
          const nameParts = displayName.split(" ");

          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "unknown@example.com";
          const username = profile.username || email.split("@")[0];

          // Генерируем случайный пароль
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          user = new User({
            githubId: profile.id,
            username,
            email,
            firstName: nameParts[0] || "Unknown",
            lastName: nameParts[1] || "",
            password: hashedPassword,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Ошибка при обработке профиля GitHub:", error);
        return done(error, null);
      }
    }
  )
);

// Сериализация пользователя
passport.serializeUser((user, done) => {
  done(null, user.id); // Сохраняем только ID пользователя в сессии
});

// Десериализация пользователя
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Находим пользователя по ID
    done(null, user); // Возвращаем пользователя
  } catch (error) {
    done(error, null);
  }
});

// Инициализация Passport
app.use(passport.initialize());
app.use(passport.session());

// Маршрут для перенаправления на GitHub
app.get("/api/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

// Маршрут для обработки callback от GitHub
app.get(
  "/api/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Пользователь авторизован:", req.user); // Логируем данные пользователя

    // Генерация JWT токена
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Перенаправляем пользователя на фронтенд с токеном
    res.redirect(`http://localhost:5173/profile?token=${token}`);
  }
);

// Маршрут для получения данных профиля
app.get("/api/auth/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Получаем токен из заголовка

  if (!token) {
    return res.status(401).json({ message: "Нет доступа" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Проверяем токен
    const user = await User.findById(decoded.userId); // Находим пользователя по ID

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
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Нет доступа" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});