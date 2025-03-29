import React, { useState, useEffect } from 'react';
import { Button, Table, Alert, Spinner, Modal, Form, Badge, Card } from 'react-bootstrap';
import { adminCategoriesApi } from '../../api/admin/categories';
import { adminAuthApi } from '../../api/admin/auth';
import '../../assets/style/admin/adminStyles.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    services: []
  });
  const [newService, setNewService] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    link: '',
    services: ''
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      await adminAuthApi.checkAdmin();
      const data = await adminCategoriesApi.getAll();
      setCategories(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки категорий');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({
      title: '',
      link: '',
      services: ''
    });
  
    try {
      if (!formData.title.trim() || !formData.link.trim()) {
        setValidationErrors({
          title: !formData.title.trim() ? 'Название обязательно' : '',
          link: !formData.link.trim() ? 'Ссылка обязательна' : '',
          services: formData.services.length === 0 ? 'Добавьте хотя бы один сервис' : ''
        });
        throw new Error('Заполните все обязательные поля');
      }
  
      const categoryData = {
        title: formData.title.trim(),
        link: formData.link.trim(),
        services: formData.services
      };
  
      if (currentCategory) {
        await adminCategoriesApi.update(currentCategory._id, categoryData);
      } else {
        await adminCategoriesApi.create(categoryData);
      }
  
      await fetchCategories();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving category:', err);
      if (err.response) {
        if (err.response.data.errors) {
          setValidationErrors(prev => ({
            ...prev,
            ...err.response.data.errors
          }));
        }
        setError(err.response.data.message || 'Ошибка при сохранении категории');
      } else {
        setError(err.message || 'Ошибка сети');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setCurrentCategory(null);
    setFormData({
      title: '',
      link: '',
      services: []
    });
    setNewService('');
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await adminCategoriesApi.delete(categoryToDelete._id);
      await fetchCategories();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err) {
      setError(err.message || 'Ошибка при удалении категории');
    }
  };

  const handleAddService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
      setValidationErrors(prev => ({
        ...prev,
        services: ''
      }));
    }
  };

  const handleRemoveService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="admin-main animate-fade">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Управление категориями</h2>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 d-flex align-items-center"
        >
          <i className="bi bi-plus-circle me-2"></i> Добавить категорию
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="animate-fade">
          {error}
        </Alert>
      )}

      {categories.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <i className="bi bi-folder-x text-muted" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3">Категории не найдены</h4>
            <p className="text-muted">Нажмите "Добавить категорию" чтобы создать первую</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Ссылка</th>
                  <th>Навыки</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category._id}>
                    <td className="fw-semibold">{category.title}</td>
                    <td>
                      <a href={category.link} target="_blank" rel="noopener noreferrer">
                        {category.link}
                      </a>
                    </td>
                    <td>
                      {category.services && category.services.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {category.services.map(service => (
                            <Badge key={service} pill bg="info" className="p-2 animate-pop">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">Нет навыков</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons d-flex">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2 px-3 py-1 d-flex align-items-center"
                          onClick={() => {
                            setCurrentCategory(category);
                            setFormData({
                              title: category.title,
                              link: category.link,
                              services: category.services || []
                            });
                            setShowModal(true);
                          }}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Редакт.
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="px-3 py-1 d-flex align-items-center"
                          onClick={() => confirmDelete(category)}
                        >
                          <i className="bi bi-trash me-1"></i> Удалить
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      <Modal show={showModal} onHide={() => !isSubmitting && setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {currentCategory ? 'Редактировать категорию' : 'Добавить новую категорию'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Название *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                required
                disabled={isSubmitting}
                isInvalid={!!validationErrors.title}
                placeholder="Введите название категории"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Ссылка *</Form.Label>
              <Form.Control
                type="text"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({...prev, link: e.target.value}))}
                required
                disabled={isSubmitting}
                isInvalid={!!validationErrors.link}
                placeholder="Введите ссылку для категории"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.link}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Навыки *</Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Добавить навык"
                  disabled={isSubmitting}
                  isInvalid={!!validationErrors.services}
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                />
                <Button
                  variant="outline-primary"
                  className="ms-2"
                  onClick={handleAddService}
                  disabled={isSubmitting || !newService.trim()}
                >
                  <i className="bi bi-plus-lg"></i>
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {validationErrors.services || 'Добавьте хотя бы один навык'}
              </Form.Control.Feedback>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {formData.services.map(service => (
                  <Badge 
                    key={service} 
                    pill
                    bg="primary" 
                    className="p-2 d-flex align-items-center animate-pop skill-badge"
                  >
                    <span className="skill-text">{service}</span>
                    <button 
                      type="button" 
                      className="btn-close btn-close-white ms-2 skill-remove" 
                      onClick={(e) => {
                        e.stopPropagation();
                        !isSubmitting && handleRemoveService(service);
                      }}
                      aria-label="Удалить"
                    />
                  </Badge>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button 
            variant="light" 
            onClick={() => setShowModal(false)}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.link || formData.services.length === 0}
          >
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                {currentCategory ? 'Сохранение...' : 'Создание...'}
              </>
            ) : (
              currentCategory ? 'Сохранить изменения' : 'Создать категорию'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="delete-confirmation-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Подтверждение удаления
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center mb-4">
            <i className="bi bi-trash-fill text-danger" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3">Вы уверены, что хотите удалить категорию?</h4>
            <p className="text-muted">Категория: <strong>{categoryToDelete?.title}</strong></p>
            
            <Alert variant="danger" className="d-flex align-items-center">
              <i className="bi bi-exclamation-octagon-fill me-2"></i>
              <div>
                Это действие нельзя отменить. Все заказы в этой категории будут удалены.
              </div>
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-center">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2"
          >
            <i className="bi bi-x-circle me-2"></i> Отмена
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            className="px-4 py-2"
          >
            <i className="bi bi-trash-fill me-2"></i> Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categories;