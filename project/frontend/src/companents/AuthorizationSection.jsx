// AuthorizationSection.jsx
import React, { useState } from "react";
import "../style/AuthorizationSection.css"; // Убедитесь, что путь к стилям корректен

const AuthorizationSection = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const togglePanel = () => {
    setIsSignUpActive(!isSignUpActive); // Переключаем состояние
  };

  return (
    <div className="authorization-container">
      {/* Forms Container */}
      <div className="forms-container">
        {/* Регистрация */}
        <div
          className={`form-wrapper form-signup ${
            isSignUpActive ? "active" : "inactive"
          }`}
        >
          <form className="auth-form" id="form1" onSubmit={(e) => e.preventDefault()}>
            <h2 className="form-title">Регистрация</h2>
            <input type="text" placeholder="Имя пользователя" className="auth-input" required />
            <input type="email" placeholder="Email" className="auth-input" required />
            <input type="password" placeholder="Пароль" className="auth-input" required />
            <button className="auth-btn" type="submit">
              Зарегистрироваться
            </button>
            <p className="toggle-text">
              Уже есть аккаунт?{" "}
              <span className="toggle-link" onClick={togglePanel}>
                Войти
              </span>
            </p>
          </form>
        </div>

        {/* Авторизация */}
        <div
          className={`form-wrapper form-signin ${
            !isSignUpActive ? "active" : "inactive"
          }`}
        >
          <form className="auth-form" id="form2" onSubmit={(e) => e.preventDefault()}>
            <h2 className="form-title">Авторизация</h2>
            <input type="email" placeholder="Email" className="auth-input" required />
            <input type="password" placeholder="Пароль" className="auth-input" required />
            <button className="auth-btn" type="submit">
              Войти
            </button>
            <p className="toggle-text">
              Нет аккаунта?{" "}
              <span className="toggle-link" onClick={togglePanel}>
                Зарегистрироваться
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* Overlay Panel */}
      <div className="overlay-container">
        <div className="overlay overlay-left">
          <div className="overlay-panel">
            <h1>{!isSignUpActive ? "Добро пожаловать!" : "Привет, друг!"}</h1>
            <p>
              {!isSignUpActive
                ? "Чтобы оставаться на связи, войдите с помощью своих данных"
                : "Введите свои данные и начните свое путешествие с нами"}
            </p>
            <button className="toggle-btn" onClick={togglePanel}>
              {isSignUpActive ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>
        </div>
        <div className="overlay overlay-right">
          <div className="overlay-panel">
            <h1>{!isSignUpActive ? "Привет, друг!" : "Добро пожаловать!"}</h1>
            <p>
              {!isSignUpActive
                ? "Введите свои данные и начните свое путешествие с нами"
                : "Чтобы оставаться на связи, войдите с помощью своих данных"}
            </p>
            <button className="toggle-btn" onClick={togglePanel}>
              {isSignUpActive ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationSection;