import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/services/WebDev.css';
import { fetchOrders } from '../../api/services/web'; 

const WebDev = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  // Функция для загрузки заказов с пагинацией
  const loadOrders = async (page = 1, limit = 10) => {
    try {
      const data = await fetchOrders(page, limit);
      console.log('Данные с бэкенда:', data); // Лог для отладки
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

  // Загрузка данных при изменении страницы или лимита
  useEffect(() => {
    loadOrders(currentPage, limit);
  }, [currentPage, limit]);

  // Обработчик изменения страницы
  const handlePageChange = (page) => {
    console.log('Переход на страницу:', page); // Лог для отладки
    setCurrentPage(page);
  };

  // Генерация кнопок пагинации
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
          <div className="mb-3">
            <label className="form-label">Навыки:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Навыки"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Сортировка по времени:</label>
            <select className="form-select">
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Сортировка по цене:</label>
            <select className="form-select">
              <option value="none">Без сортировки</option>
              <option value="priceHighToLow">Цена: по убыванию</option>
              <option value="priceLowToHigh">Цена: по возрастанию</option>
            </select>
          </div>
        </div>

        <div className="col-md-9 orders-section">
          <h3 className="mb-4">Заказы</h3>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="card mb-3">
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

          {/* Кастомная пагинация */}
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