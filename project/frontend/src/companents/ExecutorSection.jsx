import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/ExecutorSection.css';
import { FaDesktop, FaPaintBrush, FaCode, FaRobot } from 'react-icons/fa'; 

const CategoryPage = () => {
    const categories = [
        {
            title: "Веб-сайты, IT и Программирование",
            icon: <FaDesktop size={24} className="icon" />,
            services: ["PHP", "HTML", "JavaScript", "React", "Node.js"]
        },
        {
            title: "Дизайн, Медиа и Архитектура",
            icon: <FaPaintBrush size={24} className="icon" />,
            services: ["Графический дизайн", "Логотипы", "Photoshop", "Illustrator"]
        },
        {
            title: "Инженерия и Наука",
            icon: <FaCode size={24} className="icon" />,
            services: ["AutoCAD", "Электротехника", "Электроника"]
        },
        {
            title: "Искусственный Интеллект",
            icon: <FaRobot size={24} className="icon" />,
            services: ["Разработка AI-чатов", "Интеграция ChatGPT", "LLM"]
        }
    ];

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5 section-title">Категории фриланса</h1>
            <div className="row">
                {categories.map((category, index) => (
                    <div key={index} className="col-md-6 col-lg-3 mb-4">
                        <div className="d-flex align-items-start">
                            <div className="icon-container me-3">
                                {category.icon} 
                            </div>
                            <div className="flex-grow-1">
                                <h3 className="category-title mb-2">{category.title}</h3> 
                                <p className="services-list mb-0">
                                    {category.services.join(", ")}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;