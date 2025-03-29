import session from "express-session";

const configureSession = () => {
  return session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  });
};

export default configureSession;