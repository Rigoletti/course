import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../style/services/WebDev.css';
import { fetchOrders } from '../../../api/services/web';

const WebDev = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate(); // Хук для навигации

  const loadOrders = async (page = 1, limit = 10) => {
    try {
      const data = await fetchOrders(page, limit);
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } else {
        console.error('Ошибка при загрузке заказов:', data.message);
      }
    } catch (error) {
      console.error('Ошибка при загрузке заказов:', error);
    }
  };

  useEffect(() => {
    loadOrders(currentPage, limit);
  }, [currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Обработчик клика на заказ
  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`); // Перенаправляем на страницу заказа
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="container-fluid vh-100 p-4">
      <div className="mb-4">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Поиск по ключевым словам"
        />
      </div>

      <div className="row flex-grow-1">
        <div className="col-md-3 border-end pe-3 filters-section">
          <h3 className="mb-4">Фильтры</h3>
          {/* Фильтры */}
        </div>

        <div className="col-md-9 orders-section">
          <h3 className="mb-4">Заказы</h3>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="card mb-3"
                onClick={() => handleOrderClick(order._id)} // Добавляем обработчик клика
                style={{ cursor: 'pointer' }} // Меняем курсор при наведении
              >
                <div className="card-body d-flex justify-content-between">
                  <div className="flex-grow-1 me-3">
                    <h4 className="card-title">{order.title}</h4>
                    <p className="card-text text-muted">Осталось дней: {order.daysLeft}</p>
                    <p className="card-text">{order.description}</p>
                    <div className="mt-3">
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
                  <div className="text-end">
                    <h3 className="text-success">{order.price.toLocaleString()}₽</h3>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Заказов нет.</p>
          )}

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Назад
            </button>
            {renderPagination()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Вперед
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDev;