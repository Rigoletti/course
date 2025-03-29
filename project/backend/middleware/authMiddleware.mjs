import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // 1. Check Authorization header
  let token = req.headers.authorization?.split(' ')[1];
  
  // 2. Check cookies if no token in headers
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Authorization required" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decoded.userId,
      role: decoded.role,
      needsCompletion: decoded.needsCompletion || false
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: "Требуется авторизация" 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: "Доступ запрещен. Требуются права администратора." 
    });
  }

  next();
};

// Middleware для проверки подтвержденного email
export const isVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: "Требуется авторизация" 
    });
  }


  next();
};