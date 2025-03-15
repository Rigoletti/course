import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api/api";
import "../style/AuthorizationSection.css";

const AuthorizationSection = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };
  // Функция для переключения между формами
  const togglePanel = () => {
    setIsSignUpActive(!isSignUpActive);
    clearMessage();
  };

  // Функция для отображения сообщений
  const showMessage = (type, content) => {
    console.log(`Показываем сообщение: type=${type}, content=${content}`); // Логируем сообщение
    clearMessage();
    setMessage({ type, content });
    setTimeout(clearMessage, 3000); // Скрываем сообщение через 3 секунды
  };

  // Функция для очистки сообщений
  const clearMessage = () => {
    setMessage(null);
  };

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

  // Обработка отправки формы регистрации
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
  
    // Валидация данных
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
      const data = await registerUser({ firstName, lastName, username, email, password });
      showMessage("success", data.message || "Письмо с подтверждением отправлено на ваш email.");
      setIsSignUpActive(false); // Переключение на форму входа
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      console.log("Ответ сервера:", error.response); // Логируем весь ответ сервера
  
      let errorMessage = "Произошла неизвестная ошибка. Пожалуйста, попробуйте позже.";
  
      // Если есть ответ от сервера
      if (error.response) {
        // Проверяем несколько возможных мест, где может быть сообщение об ошибке
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.message) {
          errorMessage = error.response.message;
        }
      } else if (error.message) {
        // Если ошибка пришла в поле message
        errorMessage = error.message;
      }
  
      // Показываем сообщение пользователю
      showMessage("error", errorMessage);
    }
  };

  // Обработка отправки формы входа
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      return showMessage("error", "Пожалуйста, заполните все поля.");
    }

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      showMessage("success", data.message || "Авторизация успешна");
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка при авторизации:", error);

      let errorMessage = "Ошибка авторизации.";
      if (error.response) {
        // Если есть ответ от сервера
        console.log("Ответ сервера:", error.response.data);

        if (error.response.data && typeof error.response.data.message === "string") {
          // Извлекаем сообщение из ответа сервера
          errorMessage = error.response.data.message;

          // Дополнительная обработка для более понятных сообщений
          if (errorMessage.includes("email") || errorMessage.includes("password")) {
            errorMessage =
              "Неверный email или пароль. Пожалуйста, проверьте введенные данные.";
          } else if (errorMessage.includes("confirmed")) {
            errorMessage =
              "Подтвердите ваш email для входа. Проверьте почту.";
          }
        } else {
          // Если структура ответа некорректна
          errorMessage =
            "К сожалению, произошла ошибка на сервере. Пожалуйста, попробуйте позже.";
        }
      } else if (error.request) {
        // Если запрос был сделан, но сервер не ответил
        errorMessage =
          "Не удалось связаться с сервером. Пожалуйста, проверьте подключение к интернету.";
      } else {
        // Если запрос даже не был отправлен (например, проблема с сетью)
        errorMessage =
          "Произошла неизвестная ошибка. Пожалуйста, попробуйте позже.";
        console.error("Детали ошибки:", error.message);
      }

      // Показываем сообщение пользователю
      showMessage("error", errorMessage);
    }
  };

  return (
    <div className="authorization-container">
      <div className="forms-container">
        {/* Форма регистрации */}
        <div
          className={`form-wrapper form-signup ${isSignUpActive ? "active" : "inactive"}`}
        >
          <form className="auth-form" id="form1" onSubmit={handleRegisterSubmit}>
            <h2 className="form-title">Присоединяйтесь к нам</h2>
            <input
              type="text"
              name="firstName"
              placeholder="Имя"
              className="auth-input"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Фамилия"
              className="auth-input"
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Логин"
              className="auth-input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="auth-input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              className="auth-input"
              required
            />
            <button className="auth-btn" type="submit">
              Создать аккаунт
            </button>
          </form>
        </div>

        {/* Форма входа */}
        <div
          className={`form-wrapper form-signin ${!isSignUpActive ? "active" : "inactive"}`}
        >
          <form className="auth-form" id="form2" onSubmit={handleLoginSubmit}>
            <h2 className="form-title">Вход в систему</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="auth-input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              className="auth-input"
              required
            />
            <button className="auth-btn" type="submit">
              Войти
            </button>
            <button className="auth-btn github-btn" onClick={handleGitHubLogin}>
  Войти через GitHub
</button>
          </form>
        </div>
      </div>

      {/* Overlay Panel */}
      <div className="overlay-container">
        <div className="overlay overlay-left">
          <div className="overlay-panel">
            <h1>
              {!isSignUpActive
                ? "Найдите идеального исполнителя!"
                : "Станьте частью команды!"}
            </h1>
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
            <h1>
              {!isSignUpActive
                ? "Станьте частью команды!"
                : "Найдите идеального исполнителя!"}
            </h1>
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

      {/* Блок уведомлений */}
      {message && (
        <div className="notification-container">
          <div className={`${message.type}-message`}>{message.content}</div>
        </div>
      )}
    </div>
  );
};

export default AuthorizationSection;