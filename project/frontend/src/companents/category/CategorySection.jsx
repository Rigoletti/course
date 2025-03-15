import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../api/categories/categories"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaDesktop, FaPaintBrush, FaCode, FaRobot } from 'react-icons/fa';
import "../../style/category/CategorySection.css";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories(); // Используем функцию из categories.js
        setCategories(data);
      } catch (error) {
        console.error("Ошибка при получении категорий:", error);
      }
    };

    loadCategories();
  }, []);

  // Обработка клика по категории
  const handleCategoryClick = (link) => {
    navigate(link); // Переход на страницу категории
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5 display-4 fw-bold">Категории фриланса</h1>
      <div className="row g-4">
        {Array.isArray(categories) && categories.map((category, index) => (
          <div
            key={index}
            className="col-md-6 col-lg-3 category-column"
            onClick={() => handleCategoryClick(category.link)}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-start">
              <div className="bg-light rounded p-2 me-3">
                {category.icon === "FaDesktop" && <FaDesktop size={24} className="text-primary" />}
                {category.icon === "FaPaintBrush" && <FaPaintBrush size={24} className="text-primary" />}
                {category.icon === "FaCode" && <FaCode size={24} className="text-primary" />}
                {category.icon === "FaRobot" && <FaRobot size={24} className="text-primary" />}
              </div>
              <div className="flex-grow-1">
                <h3 className="h5 fw-bold mb-2">{category.title}</h3>
                <p className="text-muted mb-2">
                  {category.services.join(", ")}
                </p>
              </div>
            </div>
            <div className="subtopics-container">
              <ul className="list-unstyled">
                {category.subtopics.map((subtopic, subIndex) => (
                  <li key={subIndex} className="mb-2">
                    <span className="d-block">{subtopic.name}</span>
                    <small className="text-muted">{subtopic.orders} заказов</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;