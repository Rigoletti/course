import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../api/categories/categories";
import { createOrderRequest } from "../../api/services/orders";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/style/PostProject/PostProject.css";

const PostProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    selectedSkills: [],
    category: "",
    subtopic: "",
    price: 1000,
    daysLeft: 7
  });
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({
            ...prev,
            category: data[0]._id,
            skills: data[0].services || [],
            subtopic: data[0].services[0] || ""
          }));
        }
      } catch (err) {
        setError(err.message);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      const category = categories.find(c => c._id === formData.category);
      if (category) {
        setFormData(prev => ({
          ...prev,
          skills: category.services || [],
          subtopic: category.services[0] || ""
        }));
      }
    }
  }, [formData.category, categories]);

  const handleSkillChange = (skill) => {
    if (formData.selectedSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        selectedSkills: prev.selectedSkills.filter(item => item !== skill)
      }));
    } else {
      if (formData.selectedSkills.length < 5) {
        setFormData(prev => ({
          ...prev,
          selectedSkills: [...prev.selectedSkills, skill]
        }));
      } else {
        alert("Можно добавить не более 5 навыков.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubtopicChange = (e) => {
    setFormData(prev => ({
      ...prev,
      subtopic: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!formData.title || !formData.description || !formData.category || 
          !formData.subtopic || formData.selectedSkills.length === 0 || 
          !formData.price || !formData.daysLeft) {
        throw new Error("Заполните все обязательные поля");
      }

      const price = Number(formData.price);
      const daysLeft = Number(formData.daysLeft);

      if (isNaN(price) || isNaN(daysLeft)) {
        throw new Error("Цена и срок должны быть числами");
      }

      const response = await createOrderRequest({
        title: formData.title,
        description: formData.description,
        skills: formData.selectedSkills,
        category: formData.category,
        subtopic: formData.subtopic, 
        price: price,
        daysLeft: daysLeft
      });
      if (response.success) {
        setShowSuccessModal(true);
      } else {
        throw new Error(response.message || "Ошибка при отправке заявки");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/profile");
  };

  const filteredSkills = formData.skills.filter(
    skill => skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
             !formData.selectedSkills.includes(skill)
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body p-5">
          <h2 className="mb-4">Создание нового заказа</h2>
          
          {error && (
            <div className="alert alert-danger mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Название заказа *</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Описание *</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Категория *</label>
                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Подкатегория *</label>
                <select
                  className="form-select"
                  name="subtopic"
                  value={formData.subtopic}
                  onChange={handleSubtopicChange}
                  required
                >
                  {formData.skills.map(skill => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Бюджет (₽) *</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="100"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Срок выполнения (дней) *</label>
                <input
                  type="number"
                  className="form-control"
                  name="daysLeft"
                  value={formData.daysLeft}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Навыки * <small>(максимум 5)</small>
              </label>
              <div className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск навыков"
                />
              </div>
              
              <div className="mb-3">
                <h6>Выбранные навыки:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {formData.selectedSkills.map(skill => (
                    <Badge key={skill} bg="primary" className="d-flex align-items-center">
                      {skill}
                      <button 
                        type="button" 
                        className="btn-close btn-close-white ms-2" 
                        onClick={() => handleSkillChange(skill)}
                        aria-label="Удалить"
                        style={{ fontSize: '0.5rem' }}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {searchQuery && (
                <div className="mt-3">
                  <h6>Доступные навыки:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {filteredSkills.map(skill => (
                      <Button
                        key={skill}
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleSkillChange(skill)}
                        disabled={formData.selectedSkills.length >= 5}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button 
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100 py-2"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Отправка...
                </>
              ) : (
                'Отправить заказ'
              )}
            </Button>
          </form>
        </div>
      </div>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#28a745" className="bi bi-check-circle-fill mb-3" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h4 className="mb-3 fw-bold">Ваш заказ успешно создан!</h4>
          <p className="text-muted">После модерации он станет доступен для исполнителей.</p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="success" onClick={handleCloseSuccessModal} className="px-4 py-2">
            Перейти в профиль
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PostProject;