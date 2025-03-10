import React, { useState } from "react";

const WebDev = () => {
  const [orders, setOrders] = useState([
    { id: 1, title: "Разработка сайта", budget: 1000, skills: ["React", "Node.js"], languages: ["JavaScript"], location: "Москва", date: "2023-10-01" },
    { id: 2, title: "Создание лендинга", budget: 500, skills: ["HTML", "CSS"], languages: ["JavaScript"], location: "Санкт-Петербург", date: "2023-09-15" },
    { id: 3, title: "Разработка API", budget: 1500, skills: ["Python", "Django"], languages: ["Python"], location: "Новосибирск", date: "2023-10-10" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [languagesFilter, setLanguagesFilter] = useState("");
  const [sortByDate, setSortByDate] = useState("newest");

  const filteredOrders = orders
    .filter(order => order.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(order => locationFilter ? order.location.toLowerCase().includes(locationFilter.toLowerCase()) : true)
    .filter(order => budgetFilter ? order.budget <= parseInt(budgetFilter) : true)
    .filter(order => skillsFilter ? order.skills.some(skill => skill.toLowerCase().includes(skillsFilter.toLowerCase())) : true)
    .filter(order => languagesFilter ? order.languages.some(language => language.toLowerCase().includes(languagesFilter.toLowerCase())) : true)
    .sort((a, b) => sortByDate === "newest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "20px" }}>
      {/* Поиск сверху */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Поиск по ключевым словам"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        />
      </div>

      <div style={{ display: "flex", flex: 1, gap: "20px" }}>
        {/* Фильтры слева */}
        <div style={{ width: "250px", borderRight: "1px solid #ccc", paddingRight: "20px" }}>
          <h3>Фильтры</h3>
          <div style={{ marginBottom: "15px" }}>
            <label>Местоположение:</label>
            <input
              type="text"
              placeholder="Город"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Бюджет:</label>
            <input
              type="number"
              placeholder="Макс. бюджет"
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Навыки:</label>
            <input
              type="text"
              placeholder="Навыки"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Языки:</label>
            <input
              type="text"
              placeholder="Языки программирования"
              value={languagesFilter}
              onChange={(e) => setLanguagesFilter(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Сортировка по дате:</label>
            <select
              value={sortByDate}
              onChange={(e) => setSortByDate(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
            </select>
          </div>
        </div>

        {/* Заказы справа */}
        <div style={{ flex: 1 }}>
          <h3>Заказы</h3>
          {filteredOrders.map(order => (
            <div
              key={order.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <h4>{order.title}</h4>
              <p><strong>Бюджет:</strong> ${order.budget}</p>
              <p><strong>Навыки:</strong> {order.skills.join(", ")}</p>
              <p><strong>Языки:</strong> {order.languages.join(", ")}</p>
              <p><strong>Местоположение:</strong> {order.location}</p>
              <p><strong>Дата:</strong> {order.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebDev;