import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/services/WebDev.css';
import { fetchOrders } from '../../api/services/web'; 

const WebDev = () => {
  const [orders, setOrders] = useState([]); // Изначально пустой массив
  const [searchTerm, setSearchTerm] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [sortByTime, setSortByTime] = useState("newest");
  const [sortByPrice, setSortByPrice] = useState("none");

  // Загрузка данных с бэкенда при монтировании компонента
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      }
    };

    loadOrders();
  }, []);

  // Фильтрация и сортировка заказов
  const filteredOrders = orders
    .filter(order => order.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(order => skillsFilter ? order.skills.some(skill => skill.toLowerCase().includes(skillsFilter.toLowerCase())) : true)
    .sort((a, b) => {
      if (sortByTime === "newest") {
        return b.daysLeft - a.daysLeft;
      } else if (sortByTime === "oldest") {
        return a.daysLeft - b.daysLeft;
      }
      return 0;
    })
    .sort((a, b) => {
      if (sortByPrice === "priceHighToLow") {
        return b.price - a.price;
      } else if (sortByPrice === "priceLowToHigh") {
        return a.price - b.price;
      }
      return 0;
    });

  return (
    <div className="container-fluid vh-100 p-4">
      {/* Поиск сверху */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Поиск по ключевым словам"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row flex-grow-1">
        {/* Фильтры слева */}
        <div className="col-md-3 border-end pe-3 filters-section">
          <h3 className="mb-4">Фильтры</h3>
          <div className="mb-3">
            <label className="form-label">Навыки:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Навыки"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Сортировка по времени:</label>
            <select
              className="form-select"
              value={sortByTime}
              onChange={(e) => setSortByTime(e.target.value)}
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Сортировка по цене:</label>
            <select
              className="form-select"
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
            >
              <option value="none">Без сортировки</option>
              <option value="priceHighToLow">Цена: по убыванию</option>
              <option value="priceLowToHigh">Цена: по возрастанию</option>
            </select>
          </div>
        </div>

        {/* Заказы справа */}
        <div className="col-md-9 orders-section">
          <h3 className="mb-4">Заказы</h3>
          {filteredOrders.map(order => (
            <div
              key={order._id} // Используем _id из MongoDB
              className="card mb-3"
            >
              <div className="card-body d-flex justify-content-between">
                {/* Левая часть карточки */}
                <div className="flex-grow-1 me-3">
                  <h4 className="card-title">{order.title}</h4>
                  <p className="card-text text-muted">Осталось дней: {order.daysLeft}</p>
                  <p className="card-text">{order.description}</p>
                  <div className="mt-3">
                    <strong>Требуемые навыки:</strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {order.skills.map((skill, index) => (
                        <span key={index} className="badge bg-primary">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Правая часть карточки (цена) */}
                <div className="text-end">
                  <h3 className="text-success">{order.price.toLocaleString()}₽</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebDev;