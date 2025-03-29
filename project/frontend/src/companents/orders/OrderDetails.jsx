import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById } from '../../api/services/orders';
import "../../assets/style/orders/OrderDetails.css";
import Header from '../layout/Header';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const response = await fetchOrderById(orderId);
        
        if (response.success) {
          setOrder(response.order);
        } else {
          setError(response.message || 'Заказ не найден');
        }
      } catch (err) {
        console.error('Ошибка при загрузке заказа:', err);
        setError(err.message || 'Ошибка при загрузке заказа');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Загружаем информацию о заказе...</p>
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
        <button onClick={handleBack} className="btn btn-outline-primary mt-3">
          ← Вернуться назад
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">
            <i className="bi bi-exclamation-circle text-muted" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3">Заказ не найден</h5>
            <p className="text-muted">Возможно, он был удален или перемещен</p>
            <button onClick={handleBack} className="btn btn-primary mt-3">
              ← Вернуться к списку заказов
            </button>
          </div>
        </div>
      </div>
    );
  }

  const client = order.client || {
    name: 'Неизвестно',
    surname: '',
    registeredAt: new Date().toISOString(),
    rating: 0,
    reviewsCount: 0
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="order-details-page">
      <Header />
      
      <div className="container py-5">
        <button 
          onClick={handleBack} 
          className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2"
        >
          <i className="bi bi-arrow-left"></i>
          Назад к заказам
        </button>
        
        <div className="row g-4">
          {/* Основная информация о заказе */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <h1 className="fw-bold mb-3">{order.title}</h1>
                  <div className="d-flex flex-column align-items-end">
                    <span className="badge bg-success bg-opacity-10 text-success fs-4 mb-2">
                      {order.price.toLocaleString()}₽
                    </span>
                    <span className="text-muted small">Бюджет</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="badge bg-info text-dark me-2">
                    <i className="bi bi-calendar me-1"></i>
                    {formatDate(order.createdAt)}
                  </span>
                  {order.daysLeft && (
                    <span className={`badge ${order.daysLeft > 3 ? 'bg-warning' : 'bg-danger'} text-dark`}>
                      <i className="bi bi-clock me-1"></i>
                      Осталось {order.daysLeft} {order.daysLeft === 1 ? 'день' : order.daysLeft < 5 ? 'дня' : 'дней'}
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Описание заказа</h5>
                  <div className="bg-light p-3 rounded-2">
                    <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{order.description}</p>
                  </div>
                </div>
                
                {order.skills?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">Требуемые навыки</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {order.skills.map((skill, index) => (
                        <span key={index} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="d-grid gap-2 d-md-flex mt-4">
                  <button className="btn btn-primary px-4">
                    <i className="bi bi-envelope me-2"></i>
                    Отправить предложение
                  </button>
                  <button className="btn btn-outline-secondary px-4">
                    <i className="bi bi-bookmark me-2"></i>
                    Сохранить заказ
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Информация о клиенте */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">О клиенте</h5>
                
                <div className="d-flex align-items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="avatar avatar-lg bg-light rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-person fs-4 text-muted"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-0 fw-bold">{client.name} {client.surname}</h6>
                    <small className="text-muted">Зарегистрирован {formatDate(client.registeredAt)}</small>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <div className="text-warning me-2">
                      {'★'.repeat(Math.round(client.rating))}
                      {'☆'.repeat(5 - Math.round(client.rating))}
                    </div>
                    <span className="fw-bold">{client.rating.toFixed(1)}</span>
                  </div>
                  <small className="text-muted">
                    {client.reviewsCount || 0} {client.reviewsCount === 1 ? 'отзыв' : 
                    client.reviewsCount < 5 ? 'отзыва' : 'отзывов'}
                  </small>
                </div>
                
                <div className="border-top pt-3">
                  <h6 className="fw-bold mb-3">Контактная информация</h6>
                  <button className="btn btn-outline-primary w-100 mb-2">
                    <i className="bi bi-chat-left-text me-2"></i>
                    Написать сообщение
                  </button>
                  <button className="btn btn-outline-secondary w-100">
                    <i className="bi bi-eye me-2"></i>
                    Посмотреть профиль
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;