import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaDesktop, FaPaintBrush, FaCode, FaRobot } from 'react-icons/fa';
import '../style/CategorySection.css';

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate(); // Хук для навигации

    // Получить все категории
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/categories");
            console.log("Ответ от бэкенда:", response); 
            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                console.error("Ошибка: данные не являются массивом", response.data);
            }
        } catch (error) {
            console.error("Ошибка при получении категорий:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    
    const handleCategoryClick = (link) => {
        navigate(link); 
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