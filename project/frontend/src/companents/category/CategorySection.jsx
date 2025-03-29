import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../api/categories/categories";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/style/category/CategorySection.css";

const CategorySection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        
        if (!data || !Array.isArray(data)) {
          throw new Error('Не удалось загрузить категории');
        }
        
        const validCategories = data.filter(category => 
          category && category.link && typeof category.link === 'string'
        );
        
        setCategories(validCategories);
        setError(null);
      } catch (err) {
        console.error("Ошибка при получении категорий:", err);
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/orders/category/${categoryId}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Загружаем категории...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Ошибка!</strong> {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary mt-3"
        >
          <i className="bi bi-arrow-repeat me-2"></i>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="category-section">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Категории фриланса</h1>
          <p className="lead text-muted">Выберите интересующую вас категорию</p>
        </div>
        
        <div className="row g-4">
          {categories.map((category, index) => (
            <div key={category._id || index} className="col-md-6 col-lg-4 col-xl-3">
              <div 
                className="card h-100 border-0 shadow-sm hover-card"
                onClick={() => handleCategoryClick(category._id)}
              >
                <div className="card-body">
                  <h3 className="h5 fw-bold mb-3">{category.title}</h3>
                  <div className="text-muted small mb-3">
                    {Array.isArray(category.services) ? category.services.slice(0, 3).join(", ") : ""}
                    {category.services?.length > 3 && "..."}
                  </div>
                  
                  {Array.isArray(category.subtopics) && category.subtopics.length > 0 && (
                    <div className="border-top pt-3">
                      <ul className="list-unstyled mb-0">
                        {category.subtopics.slice(0, 3).map((subtopic) => (
                          <li key={subtopic.name} className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-truncate">{subtopic.name}</span>
                            <span className="badge bg-light text-dark ms-2">
                              {subtopic.orders || 0}
                            </span>
                          </li>
                        ))}
                        {category.subtopics.length > 3 && (
                          <li className="text-primary small">
                            +{category.subtopics.length - 3} подкатегорий
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-transparent border-0 pt-0">
                  <button className="btn btn-sm btn-outline-primary w-100">
                    Смотреть заказы
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;