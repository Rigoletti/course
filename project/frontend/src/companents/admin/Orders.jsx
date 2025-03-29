import React, { useState, useEffect } from 'react';
import { Button, Table, Alert, Spinner, Modal, Form, Badge, Pagination, Card } from 'react-bootstrap';
import { adminOrdersApi } from '../../api/admin/order';
import { adminCategoriesApi } from '../../api/admin/categories';
import { adminAuthApi } from '../../api/admin/auth';
import '../../assets/style/admin/adminStyles.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    subtopic: '',
    search: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await adminAuthApi.checkAdmin();
        const categoriesData = await adminCategoriesApi.getAll();
        setCategories(categoriesData);
        await loadOrders();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      loadOrders();
    }
  }, [page, filters.category, filters.subtopic]);

  const loadOrders = async () => {
    try {
      const params = {
        page,
        limit: 10,
        category: filters.category,
        subtopic: filters.subtopic
      };
      const data = await adminOrdersApi.getAll(params);
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (orderData) => {
    try {
      if (currentOrder) {
        await adminOrdersApi.update(currentOrder._id, orderData);
      } else {
        await adminOrdersApi.create(orderData);
      }
      setShowModal(false);
      setCurrentOrder(null);
      await loadOrders();
      const categoriesData = await adminCategoriesApi.getAll();
      setCategories(categoriesData);
    } catch (err) {
      let errorMessage = err.message;
      
      if (err.message.includes('No matching document')) {
        errorMessage = 'Ошибка: проблема с обновлением категории. Попробуйте выбрать другую категорию.';
      }
      
      setError(errorMessage);
    }
  };

  const confirmDelete = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await adminOrdersApi.delete(orderToDelete._id);
      await loadOrders();
      const categoriesData = await adminCategoriesApi.getAll();
      setCategories(categoriesData);
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (err) {
      let errorMessage = err.message;
      
      if (err.message.includes('Order not found')) {
        errorMessage = 'Заказ не найден';
      } else if (err.message.includes('Failed to delete order')) {
        errorMessage = 'Ошибка при удалении заказа';
      }
      
      setError(errorMessage);
    }
  };

  const getSubtopics = () => {
    if (!filters.category) return [];
    const category = categories.find(c => c._id === filters.category);
    return category?.subtopics || [];
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
        <h2 className="fw-bold text-primary">Управление заказами</h2>
        <Button 
          variant="primary" 
          onClick={() => {
            setCurrentOrder(null);
            setShowModal(true);
          }}
          className="px-4 py-2 d-flex align-items-center"
        >
          <i className="bi bi-plus-circle me-2"></i> Добавить заказ
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="animate-fade">
          {error}
        </Alert>
      )}

      <Card className="filter-card mb-4">
        <Card.Body>
          <div className="row g-3">
            <div className="col-md-4">
              <Form.Select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value, subtopic: ''})}
                className="p-2"
              >
                <option value="">Все категории</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.title}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-4">
              <Form.Select
                value={filters.subtopic}
                onChange={(e) => setFilters({...filters, subtopic: e.target.value})}
                disabled={!filters.category}
                className="p-2"
              >
                <option value="">Все подтемы</option>
                {getSubtopics().map(subtopic => (
                  <option key={subtopic.name} value={subtopic.name}>{subtopic.name}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Поиск заказов..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="p-2"
              />
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th>Название</th>
                <th>Дней осталось</th>
                <th>Цена</th>
                <th>Категория</th>
                <th>Навыки</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="fw-semibold">{order.title}</td>
                  <td>
                    <Badge bg={order.daysLeft < 3 ? 'danger' : 'warning'} className="px-3 py-2">
                      {order.daysLeft}
                    </Badge>
                  </td>
                  <td className="fw-bold text-success">{order.price} ₽</td>
                  <td>
                    {order.category?.title || 'Неизвестно'}
                    {!order.category && (
                      <span className="text-danger small ms-2">(ID: {order.category})</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {order.skills?.map(skill => (
                        <Badge key={skill} pill bg="info" className="p-2 animate-pop">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons d-flex">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2 px-3 py-1 d-flex align-items-center"
                        onClick={() => {
                          setCurrentOrder(order);
                          setShowModal(true);
                        }}
                      >
                        <i className="bi bi-pencil-square me-1"></i> Редакт.
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="px-3 py-1 d-flex align-items-center"
                        onClick={() => confirmDelete(order)}
                      >
                        <i className="bi bi-trash me-1"></i> Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Заказы не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination className="mb-0">
            <Pagination.Prev 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <Pagination.Item
                key={number}
                active={number === page}
                onClick={() => setPage(number)}
              >
                {number}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              disabled={page === totalPages} 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            />
          </Pagination>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Подтверждение удаления
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center mb-4">
            <i className="bi bi-trash-fill text-danger" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3">Вы уверены, что хотите удалить заказ?</h4>
            <p className="text-muted">Заказ: <strong>{orderToDelete?.title}</strong></p>
            
            <Alert variant="danger" className="d-flex align-items-center">
              <i className="bi bi-exclamation-octagon-fill me-2"></i>
              <div>
                Это действие нельзя отменить. Все данные заказа будут безвозвратно удалены.
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

      {/* Модальное окно редактирования/создания заказа */}
      <OrderModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        order={currentOrder}
        categories={categories}
      />
    </div>
  );
};

const OrderModal = ({ show, onHide, onSubmit, order, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    daysLeft: 1,
    description: '',
    skills: [],
    price: 0,
    category: categories[0]?._id || ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState('');

  useEffect(() => {
    if (order) {
      setFormData({
        title: order.title,
        daysLeft: order.daysLeft,
        description: order.description,
        skills: order.skills || [],
        price: order.price,
        category: order.category
      });
    } else {
      setFormData({
        title: '',
        daysLeft: 1,
        description: '',
        skills: [],
        price: 0,
        category: categories[0]?._id || ''
      });
    }
  }, [order, categories]);

  const handlePriceChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setFormData({...formData, price: value});
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    
    if (formData.skills.length >= 5) {
      setSkillError('Максимум 5 навыков в заказе');
      return;
    }

    if (!trimmedSkill) {
      setSkillError('Навык не может быть пустым');
      return;
    }

    if (formData.skills.includes(trimmedSkill)) {
      setSkillError('Этот навык уже добавлен');
      return;
    }

    setFormData({
      ...formData,
      skills: [...formData.skills, trimmedSkill]
    });
    setNewSkill('');
    setSkillError('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmitForm = () => {
    if (formData.skills.length === 0) {
      setSkillError('Добавьте хотя бы один навык');
      return;
    }

    if (formData.skills.length > 5) {
      setSkillError('Максимум 5 навыков в заказе');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {order ? 'Редактировать заказ' : 'Создать новый заказ'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Название</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              placeholder="Введите название заказа"
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Дней осталось</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.daysLeft}
                  onChange={(e) => setFormData({...formData, daysLeft: parseInt(e.target.value) || 1})}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Цена (₽)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handlePriceChange}
                  required
                />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              placeholder="Подробное описание заказа"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Навыки <span className="text-muted">({formData.skills.length}/5)</span>
            </Form.Label>
            <div className="d-flex mb-2">
              <Form.Control
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Введите навык"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                disabled={formData.skills.length >= 5}
              />
              <Button
                variant="outline-primary"
                onClick={handleAddSkill}
                disabled={formData.skills.length >= 5 || !newSkill.trim()}
                className="ms-2"
              >
                <i className="bi bi-plus-lg"></i>
              </Button>
            </div>
            
            {skillError && <Alert variant="danger" className="py-2">{skillError}</Alert>}
            
            <div className="d-flex flex-wrap gap-2 mt-2">
              {formData.skills.map(skill => (
                <Badge 
                  key={skill} 
                  pill
                  bg="primary" 
                  className="p-2 d-flex align-items-center animate-pop skill-badge"
                >
                  <span className="skill-text">{skill}</span>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white ms-2 skill-remove" 
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label="Удалить"
                  />
                </Badge>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Категория</Form.Label>
            <Form.Select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onHide}>
          Отмена
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmitForm}
          disabled={formData.skills.length > 5 || formData.skills.length === 0}
        >
          {order ? 'Сохранить изменения' : 'Создать заказ'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Orders;