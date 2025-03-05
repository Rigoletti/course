import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/logo_white.png';
import '../style/Header.css';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Функция для выхода
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header className="sticky-top header" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <nav className="navbar navbar-expand-lg navbar-dark container">
        {/* Логотип */}
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="логотип" className="img-fluid" style={{ height: '25px' }} />
        </Link>

        {/* Кнопка тогглера для мобильной версии */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Содержимое навигации */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Основные ссылки (ближе к логотипу) */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/executor" className="nav-link literata-font">
              Подать заявку
              </Link>
            </li>
      
            <li className="nav-item">
              <Link to="/jobs" className="nav-link literata-font">
                Найти работу
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/faq" className="nav-link literata-font">
                Вопросы и ответы
              </Link>
            </li>
          </ul>

          {/* Ссылки для авторизованных и неавторизованных пользователей */}
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <li className="nav-item">
                <Link to="/profile" className="nav-link literata-font">
                  Профиль
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/authorization" className="nav-link literata-font">
                  Авторизация
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;