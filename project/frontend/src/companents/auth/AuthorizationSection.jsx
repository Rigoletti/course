import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Добавлен импорт axios
import { useFormik } from "formik";
import { registerSchema, loginSchema } from "../../utils/validation";
import "../../assets/style/auth/AuthorizationSection.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthorizationSection = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  const togglePanel = () => {
    setIsSignUpActive(!isSignUpActive);
    clearMessage();
  };

  const showMessage = (type, content) => {
    console.log(`Показываем сообщение: type=${type}, content=${content}`);
    clearMessage();
    setMessage({ type, content });
    setTimeout(clearMessage, 3000);
  };

  const clearMessage = () => {
    setMessage(null);
  };

  // Форма регистрации с Formik
  const formikRegister = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/register",
          values,
          { withCredentials: true }
        );
        showMessage("success", data.message || "Регистрация прошла успешно.");
        setIsSignUpActive(false);
      } catch (error) {
        console.error("Ошибка при регистрации:", error);
        showMessage("error", error.response?.data?.message || "Произошла ошибка при регистрации.");
      }
    },
  });

  // Форма входа с Formik
  const formikLogin = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/login",
          values,
          { withCredentials: true }
        );
        
        localStorage.setItem("token", data.token);
        showMessage("success", data.message || "Авторизация успешна");
        navigate("/profile");
      } catch (error) {
        console.error("Ошибка при авторизации:", error);
        showMessage("error", error.response?.data?.message || "Ошибка авторизации.");
      }
    },
  });

  return (
    <div className="authorization-container">
      <div className="forms-container">
        {/* Форма регистрации */}
        <div className={`form-wrapper form-signup ${isSignUpActive ? "active" : "inactive"}`}>
          <form className="auth-form" id="form1" onSubmit={formikRegister.handleSubmit}>
            <h2 className="form-title">Присоединяйтесь к нам</h2>
            <input
              type="text"
              name="firstName"
              placeholder="Имя"
              className="auth-input"
              value={formikRegister.values.firstName}
              onChange={formikRegister.handleChange}
              onBlur={formikRegister.handleBlur}
            />
            {formikRegister.touched.firstName && formikRegister.errors.firstName ? (
              <div className="error-message">{formikRegister.errors.firstName}</div>
            ) : null}

            <input
              type="text"
              name="lastName"
              placeholder="Фамилия"
              className="auth-input"
              value={formikRegister.values.lastName}
              onChange={formikRegister.handleChange}
              onBlur={formikRegister.handleBlur}
            />
            {formikRegister.touched.lastName && formikRegister.errors.lastName ? (
              <div className="error-message">{formikRegister.errors.lastName}</div>
            ) : null}

            <input
              type="text"
              name="username"
              placeholder="Логин"
              className="auth-input"
              value={formikRegister.values.username}
              onChange={formikRegister.handleChange}
              onBlur={formikRegister.handleBlur}
            />
            {formikRegister.touched.username && formikRegister.errors.username ? (
              <div className="error-message">{formikRegister.errors.username}</div>
            ) : null}

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="auth-input"
              value={formikRegister.values.email}
              onChange={formikRegister.handleChange}
              onBlur={formikRegister.handleBlur}
            />
            {formikRegister.touched.email && formikRegister.errors.email ? (
              <div className="error-message">{formikRegister.errors.email}</div>
            ) : null}

            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Пароль"
                className="auth-input"
                value={formikRegister.values.password}
                onChange={formikRegister.handleChange}
                onBlur={formikRegister.handleBlur}
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formikRegister.touched.password && formikRegister.errors.password ? (
              <div className="error-message">{formikRegister.errors.password}</div>
            ) : null}

            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Подтвердите пароль"
                className="auth-input"
                value={formikRegister.values.confirmPassword}
                onChange={formikRegister.handleChange}
                onBlur={formikRegister.handleBlur}
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formikRegister.touched.confirmPassword && formikRegister.errors.confirmPassword ? (
              <div className="error-message">{formikRegister.errors.confirmPassword}</div>
            ) : null}

            <button className="auth-btn" type="submit">
              Создать аккаунт
            </button>
          </form>
        </div>

        {/* Форма входа */}
        <div className={`form-wrapper form-signin ${!isSignUpActive ? "active" : "inactive"}`}>
          <form className="auth-form" id="form2" onSubmit={formikLogin.handleSubmit}>
            <h2 className="form-title">Вход в систему</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="auth-input"
              value={formikLogin.values.email}
              onChange={formikLogin.handleChange}
              onBlur={formikLogin.handleBlur}
            />
            {formikLogin.touched.email && formikLogin.errors.email ? (
              <div className="error-message">{formikLogin.errors.email}</div>
            ) : null}

            <div className="password-input-container">
              <input
                type={showLoginPassword ? "text" : "password"}
                name="password"
                placeholder="Пароль"
                className="auth-input"
                value={formikLogin.values.password}
                onChange={formikLogin.handleChange}
                onBlur={formikLogin.handleBlur}
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formikLogin.touched.password && formikLogin.errors.password ? (
              <div className="error-message">{formikLogin.errors.password}</div>
            ) : null}

            <button className="auth-btn" type="submit">
              Войти
            </button>
            <button
              className="auth-btn github-btn"
              type="button"
              onClick={handleGitHubLogin}
            >
              Войти через GitHub
            </button>
          </form>
        </div>
      </div>

      {/* Оверлей с переключением между формами */}
      <div className="overlay-container">
        <div className="overlay overlay-left">
          <div className="overlay-panel">
            <h1>{!isSignUpActive ? "Найдите идеального исполнителя!" : "Станьте частью команды!"}</h1>
            <p>
              {!isSignUpActive
                ? "Опубликуйте свой проект и получите предложения от лучших фрилансеров."
                : "Создайте аккаунт и начните зарабатывать на своих навыках."}
            </p>
            <button className="toggle-btn" onClick={togglePanel}>
              {isSignUpActive ? "Войти" : "Создать аккаунт"}
            </button>
          </div>
        </div>
        <div className="overlay overlay-right">
          <div className="overlay-panel">
            <h1>{!isSignUpActive ? "Станьте частью команды!" : "Найдите идеального исполнителя!"}</h1>
            <p>
              {!isSignUpActive
                ? "Создайте аккаунт и начните зарабатывать на своих навыках."
                : "Опубликуйте свой проект и получите предложения от лучших фрилансеров."}
            </p>
            <button className="toggle-btn" onClick={togglePanel}>
              {isSignUpActive ? "Войти" : "Создать аккаунт"}
            </button>
          </div>
        </div>
      </div>

      {/* Уведомления */}
      {message && (
        <div className="notification-container">
          <div className={`${message.type}-message`}>{message.content}</div>
        </div>
      )}
    </div>
  );
};

export default AuthorizationSection;