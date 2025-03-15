import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, loginWithGitHub } from "../../api/auth/auth";
import "../../style/auth/AuthorizationSection.css";

const AuthorizationSection = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    loginWithGitHub(); // Используем функцию из auth.js
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

  const validateLogin = (username) => {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Zа-яА-Я]+$/;
    return regex.test(name);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!validateName(firstName) || !validateName(lastName)) {
      return showMessage(
        "error",
        "Имя и фамилия должны содержать только буквы (кириллица или латиница)."
      );
    }
    if (!validateLogin(username)) {
      return showMessage("error", "Логин должен содержать только латинские буквы и цифры.");
    }
    if (!validatePassword(password)) {
      return showMessage(
        "error",
        "Пароль должен быть минимум 8 символов, содержать хотя бы одну цифру и одну заглавную букву."
      );
    }

    try {
      const data = await registerUser({ firstName, lastName, username, email, password }); // Используем функцию из auth.js
      showMessage("success", data.message || "Письмо с подтверждением отправлено на ваш email.");
      setIsSignUpActive(false);
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      showMessage("error", error.message || "Произошла ошибка при регистрации.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      return showMessage("error", "Пожалуйста, заполните все поля.");
    }

    try {
      const data = await loginUser({ email, password }); // Используем функцию из auth.js
      localStorage.setItem("token", data.token);
      showMessage("success", data.message || "Авторизация успешна");
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      showMessage("error", error.message || "Ошибка авторизации.");
    }
  };

  return (
    <div className="authorization-container">
      <div className="forms-container">
        <div className={`form-wrapper form-signup ${isSignUpActive ? "active" : "inactive"}`}>
          <form className="auth-form" id="form1" onSubmit={handleRegisterSubmit}>
            <h2 className="form-title">Присоединяйтесь к нам</h2>
            <input type="text" name="firstName" placeholder="Имя" className="auth-input" required />
            <input type="text" name="lastName" placeholder="Фамилия" className="auth-input" required />
            <input type="text" name="username" placeholder="Логин" className="auth-input" required />
            <input type="email" name="email" placeholder="Email" className="auth-input" required />
            <input type="password" name="password" placeholder="Пароль" className="auth-input" required />
            <button className="auth-btn" type="submit">Создать аккаунт</button>
          </form>
        </div>

        <div className={`form-wrapper form-signin ${!isSignUpActive ? "active" : "inactive"}`}>
          <form className="auth-form" id="form2" onSubmit={handleLoginSubmit}>
            <h2 className="form-title">Вход в систему</h2>
            <input type="email" name="email" placeholder="Email" className="auth-input" required />
            <input type="password" name="password" placeholder="Пароль" className="auth-input" required />
            <button className="auth-btn" type="submit">Войти</button>
            <button className="auth-btn github-btn" onClick={handleGitHubLogin}>Войти через GitHub</button>
          </form>
        </div>
      </div>

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

      {message && (
        <div className="notification-container">
          <div className={`${message.type}-message`}>{message.content}</div>
        </div>
      )}
    </div>
  );
};

export default AuthorizationSection;