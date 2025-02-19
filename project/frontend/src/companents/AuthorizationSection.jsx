import React, { useState } from "react";
import { registerUser, loginUser } from "../api/api"; 
import "../style/AuthorizationSection.css";

const AuthorizationSection = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [message, setMessage] = useState(null);

  const togglePanel = () => {
    setIsSignUpActive(!isSignUpActive);
    clearMessage();
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const showMessage = (type, content) => {
    clearMessage();
    setMessage({ type, content });
    setTimeout(clearMessage, 3000);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
  
    if (!firstName || !lastName || !username || !email || !password) {
      return showMessage("error", "Пожалуйста, заполните все поля.");
    }
  
    try {
      const data = await registerUser({ firstName, lastName, username, email, password });
      showMessage("success", data.message || "Регистрация успешна");
      setTimeout(() => {
        setIsSignUpActive(false); 
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        showMessage("error", error.response.data.message);
      } else {
        showMessage("error", "Произошла ошибка при регистрации.");
      }
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
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token); 
      showMessage("success", data.message || "Авторизация успешна");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    } catch (error) {
      showMessage("error", error.message || "Ошибка авторизации");
    }
  };

  return (
    <div className="authorization-container">
      <div className="forms-container">
        {/* Форма регистрации */}
        <div className={`form-wrapper form-signup ${isSignUpActive ? "active" : "inactive"}`}>
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
            <input type="email" name="email" placeholder="Email" className="auth-input" required />
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
        <div className={`form-wrapper form-signin ${!isSignUpActive ? "active" : "inactive"}`}>
          <form className="auth-form" id="form2" onSubmit={handleLoginSubmit}>
            <h2 className="form-title">Вход в систему</h2>
            <input type="email" name="email" placeholder="Email" className="auth-input" required />
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
          </form>
        </div>
      </div>

      {/* Overlay Panel */}
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