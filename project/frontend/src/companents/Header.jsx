import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo_white.png';
import '../style/Header.css';

const Header = () => {
  return (
    <header className="sticky-top header" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <nav className="navbar navbar-expand-lg navbar-dark container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="логотип" className="img-fluid" style={{ height: '25px' }} />
        </Link>
        {/* Кнопка для мобильного меню */}
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
        {/* Основное меню */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle literata-font"
                href="#"
                id="navbarDropdown1"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Найти исполнителя
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                <li><Link to="/talent1" className="dropdown-item literata-font">Талант 1</Link></li>
                <li><Link to="/talent2" className="dropdown-item literata-font">Талант 2</Link></li>
                <li><Link to="/talent3" className="dropdown-item literata-font">Талант 3</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle literata-font"
                href="#"
                id="navbarDropdown2"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Подать заявки
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown2">
                <li><Link to="/apply1" className="dropdown-item literata-font">Заявка 1</Link></li>
                <li><Link to="/apply2" className="dropdown-item literata-font">Заявка 2</Link></li>
                <li><Link to="/apply3" className="dropdown-item literata-font">Заявка 3</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle literata-font"
                href="#"
                id="navbarDropdown3"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Найти работу
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown3">
                <li><Link to="/job1" className="dropdown-item literata-font">Работа 1</Link></li>
                <li><Link to="/job2" className="dropdown-item literata-font">Работа 2</Link></li>
                <li><Link to="/job3" className="dropdown-item literata-font">Работа 3</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle literata-font"
                href="#"
                id="navbarDropdown4"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Вопросы и ответы
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown4">
                <li><Link to="/contact1" className="dropdown-item literata-font">Контакт 1</Link></li>
                <li><Link to="/contact2" className="dropdown-item literata-font">Контакт 2</Link></li>
                <li><Link to="/contact3" className="dropdown-item literata-font">Контакт 3</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;