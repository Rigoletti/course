import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../../api/services/web';

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

  return (
    <div className="container">
      <h1>{order.title}</h1>
      <p>{order.description}</p>
      <p>Цена: {order.price.toLocaleString()}₽</p>
      <p>Осталось дней: {order.daysLeft}</p>
      <div>
        <strong>Требуемые навыки:</strong>
        <div className="d-flex flex-wrap gap-2 mt-2">
          {order.skills.map((skill, index) => (
            <span key={index} className="badge bg-primary">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;