import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../../api/services/Order';
import "../../../assets/style/services/web/WebDetails.css"
import Header from '../../layout/Header'

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(orderId);
        if (data.success) {
          setOrder(data.order);
        } else {
          setError('Заказ не найден');
        }
      } catch (error) {
        console.error('Ошибка при загрузке заказа:', error);
        setError('Ошибка при загрузке заказа');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!order) {
    return <p>Заказ не найден.</p>;
  }

  const client = order.client || {
    name: 'Неизвестно',
    surname: '',
    registeredAt: new Date().toISOString(),
    rating: 0,
  };

  return (
    <div>
      <Header />
      <div className="order-details-container">
      <div className="order-info">
        <div className="order-header">
          <h1 className="order-title">{order.title}</h1>
          <span className="order-price">{order.price.toLocaleString()}₽</span>
        </div>
        <p className="order-date">Размещено: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p className="order-description">{order.description}</p>
        <div className="order-skills">
          <strong>Требуемые навыки:</strong>
          <div className="skills-list">
            {order.skills.map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="client-info">
        <h2>О клиенте</h2>
        <p className="client-name">
          {client.name} {client.surname}
        </p>
        <div className="client-rating">
          <span className="stars">{'★'.repeat(Math.round(client.rating))}{'☆'.repeat(5 - Math.round(client.rating))}</span>
          <span className="rating-number">{client.rating.toFixed(1)}</span>
        </div>
        <p className="client-registration-date">
          Зарегистрирован: {new Date(client.registeredAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    </div>
    
  );
};

export default OrderDetails;