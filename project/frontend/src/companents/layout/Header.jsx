import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo_white.png';
import '../../assets/style/layout/Header.css';
import axios from 'axios';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Проверяем токен и получаем роль
          const response = await axios.get('http://localhost:5000/api/auth/check-role', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setIsAuthenticated(true);
          setUserRole(response.data.role || 'user');
        } catch (error) {
          console.error('Ошибка проверки авторизации:', error);
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserRole('user');
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <header className="sticky-top header" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <nav className="navbar navbar-expand-lg navbar-dark container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="логотип" className="img-fluid" style={{ height: '25px' }} />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/post-project" className="nav-link literata-font">Подать заявку</Link>
            </li>
            <li className="nav-item">
              <Link to="/category" className="nav-link literata-font">Найти работу</Link>
            </li>
            <li className="nav-item">
              <Link to="/faq" className="nav-link literata-font">Вопросы и ответы</Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                {userRole === 'admin' && (
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link literata-font">Админ панель</Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link to="/profile" className="nav-link literata-font">Профиль</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/authorization" className="nav-link literata-font">Авторизация</Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;