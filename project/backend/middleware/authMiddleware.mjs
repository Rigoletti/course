import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Получаем токен из заголовка

  if (!token) {
    return res.status(401).json({ message: "Нет доступа" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { // Добавляем информацию о пользователе в запрос
      _id: decoded.userId, // Убедитесь, что это поле называется `_id`
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Нет доступа" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Пользователь является администратором
  } else {
    res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора.' });
  }
};

export default authMiddleware;