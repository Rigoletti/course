// authRoutes.mjs
import express from "express";
import passport from "passport";
const router = express.Router();

// Маршрут для перенаправления на GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Маршрут для обработки callback от GitHub
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Пользователь авторизован:", req.user); // Логируем данные пользователя
    res.redirect("http://localhost:5000/api/auth/profile"); // Перенаправляем на фронтенд
  }
);

// Маршрут для отображения профиля
router.get("/profile", (req, res) => {
  console.log("Запрос на /profile"); // Логируем запрос
  if (!req.user) {
    console.log("Пользователь не авторизован"); // Логируем отсутствие авторизации
    return res.redirect("/login");
  }

  console.log("Данные пользователя:", req.user); // Логируем данные пользователя
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
});

export default router;