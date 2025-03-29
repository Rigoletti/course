import React, { useState, useEffect } from 'react';
import { Button, Table, Alert, Spinner, Modal, Form, Badge } from 'react-bootstrap';
import { 
  getOrderRequests, 
  approveOrderRequest, 
  rejectOrderRequest,
  updateOrderRequest
} from '../../api/services/orders';
import { fetchCategories } from '../../api/categories/categories';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/style/admin/adminStyles.css';

const OrderRequests = () => {
  const [state, setState] = useState({
    requests: [],
    loading: true,
    error: null,
    showApproveModal: false,
    showRejectModal: false,
    showEditModal: false,
    currentRequest: null,
    categories: [],
    statusFilter: 'pending',
    formData: {
      daysLeft: 7,
      price: 1000,
      adminComment: ''
    },
    editFormData: {
      title: '',
      description: '',
      skills: [],
      category: '',
      price: 0,
      daysLeft: 0
    }
  });

  const loadRequests = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const data = await getOrderRequests(state.statusFilter);
      setState(prev => ({ ...prev, requests: data.data || [], error: null }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message, requests: [] }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setState(prev => ({ ...prev, categories: data }));
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    loadRequests();
    loadCategories();
  }, [state.statusFilter]);

  const handleApprove = async () => {
    try {
      if (!state.currentRequest) {
        throw new Error("Не выбрана заявка для одобрения");
      }
  
      // Получаем категорию для определения доступных подкатегорий
      const category = state.categories.find(c => c._id === state.currentRequest.category?._id);
      const subtopic = category?.services?.find(s => 
        state.currentRequest.skills?.includes(s)
      ) || state.currentRequest.skills?.[0];
  
      if (!subtopic) {
        throw new Error("Не удалось определить подкатегорию");
      }
  
      const response = await approveOrderRequest(state.currentRequest._id, {
        adminComment: state.formData.adminComment,
        subtopic: subtopic
      });
      
      setState(prev => ({ 
        ...prev, 
        showApproveModal: false,
        formData: { ...prev.formData, adminComment: '' }
      }));
      await loadRequests();
    } catch (err) {
      console.error('Approval error:', err);
      setState(prev => ({ 
        ...prev, 
        error: err.response?.data?.message || err.message || 'Ошибка при одобрении заявки'
      }));
    }
  };
  const handleReject = async () => {
    try {
      await rejectOrderRequest(state.currentRequest._id, {
        adminComment: state.formData.adminComment
      });
      setState(prev => ({ ...prev, showRejectModal: false }));
      await loadRequests();
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message }));
    }
  };

  const handleEdit = async () => {
    try {
      await updateOrderRequest(state.currentRequest._id, state.editFormData);
      setState(prev => ({ ...prev, showEditModal: false }));
      await loadRequests();
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value
      }
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      editFormData: {
        ...prev.editFormData,
        [name]: value
      }
    }));
  };

  if (state.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="admin-main animate-fade">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Заявки на создание заказов</h2>
        <div className="d-flex gap-2">
          <Form.Select
            value={state.statusFilter}
            onChange={(e) => setState(prev => ({ ...prev, statusFilter: e.target.value }))}
            className="p-2"
          >
            <option value="pending">Ожидают рассмотрения</option>
            <option value="approved">Одобренные</option>
            <option value="rejected">Отклоненные</option>
          </Form.Select>
        </div>
      </div>

      {state.error && (
        <Alert variant="danger" onClose={() => setState(prev => ({ ...prev, error: null }))} dismissible className="animate-fade">
          {state.error}
        </Alert>
      )}

      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead>
            <tr>
              <th>Название</th>
              <th>Автор</th>
              <th>Категория</th>
              <th>Навыки</th>
              <th>Бюджет</th>
              <th>Срок</th>
              <th>Дата</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {state.requests.map(request => (
              <tr key={request._id}>
                <td className="fw-semibold">{request.title}</td>
                <td>
                  {request.createdBy?.firstName} {request.createdBy?.lastName}
                </td>
                <td>{request.category?.title}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    {request.skills?.map(skill => (
                      <Badge key={skill} pill bg="info" className="p-2 animate-pop">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td>{request.price} ₽</td>
                <td>{request.daysLeft} дней</td>
                <td>
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td>
                  {request.status === 'pending' ? (
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => {
                          setState(prev => ({
                            ...prev,
                            currentRequest: request,
                            showApproveModal: true
                          }));
                        }}
                      >
                        Одобрить
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setState(prev => ({
                            ...prev,
                            currentRequest: request,
                            showRejectModal: true
                          }));
                        }}
                      >
                        Отклонить
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <Badge bg={request.status === 'approved' ? 'success' : 'danger'} className="me-2">
                        {request.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                      </Badge>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setState(prev => ({
                            ...prev,
                            currentRequest: request,
                            editFormData: {
                              title: request.title,
                              description: request.description,
                              skills: request.skills,
                              category: request.category?._id || request.category,
                              price: request.price,
                              daysLeft: request.daysLeft
                            },
                            showEditModal: true
                          }));
                        }}
                      >
                        Редактировать
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {state.requests.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  Заявки не найдены
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Модальное окно одобрения */}
      <Modal show={state.showApproveModal} onHide={() => setState(prev => ({ ...prev, showApproveModal: false }))} centered>
        <Modal.Header closeButton>
          <Modal.Title>Одобрить заявку</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Комментарий (необязательно)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="adminComment"
                value={state.formData.adminComment}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setState(prev => ({ ...prev, showApproveModal: false }))}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleApprove}>
            Одобрить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно отклонения */}
      <Modal show={state.showRejectModal} onHide={() => setState(prev => ({ ...prev, showRejectModal: false }))} centered>
        <Modal.Header closeButton>
          <Modal.Title>Отклонить заявку</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Причина отклонения</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="adminComment"
                value={state.formData.adminComment}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setState(prev => ({ ...prev, showRejectModal: false }))}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Отклонить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно редактирования */}
      <Modal show={state.showEditModal} onHide={() => setState(prev => ({ ...prev, showEditModal: false }))} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Редактирование заявки</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={state.editFormData.title}
                onChange={handleEditInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={state.editFormData.description}
                onChange={handleEditInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Навыки (через запятую)</Form.Label>
              <Form.Control
                type="text"
                name="skills"
                value={state.editFormData.skills.join(', ')}
                onChange={(e) => {
                  setState(prev => ({
                    ...prev,
                    editFormData: {
                      ...prev.editFormData,
                      skills: e.target.value.split(',').map(s => s.trim())
                    }
                  }));
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Категория</Form.Label>
              <Form.Select
                name="category"
                value={state.editFormData.category}
                onChange={handleEditInputChange}
              >
                {state.categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Цена (₽)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={state.editFormData.price}
                    onChange={handleEditInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Срок (дней)</Form.Label>
                  <Form.Control
                    type="number"
                    name="daysLeft"
                    value={state.editFormData.daysLeft}
                    onChange={handleEditInputChange}
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setState(prev => ({ ...prev, showEditModal: false }))}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Сохранить изменения
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderRequests;