import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { BiCategory, BiTask } from "react-icons/bi";
import Categories from "./Categories";
import Orders from "./Orders";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/style/admin/adminStyles.css';

const AdminPanel = () => {
  const location = useLocation();
  const activeTab = location.pathname;

  return (
    <div className="admin-panel-wrapper">
      <div className="admin-sidebar">
        <div className="sidebar-content">
          <div className="text-center mb-4 py-3">
            <h2 className="h5 text-white mb-0">Меню</h2>
          </div>
          <nav className="nav flex-column">
            <Link
              to="/admin/categories"
              className={`nav-link rounded mb-1 ${activeTab.includes('categories') ? 'active' : ''}`}
            >
              <BiCategory className="me-2" />
              Категории
            </Link>
            <Link
              to="/admin/orders"
              className={`nav-link rounded mb-1 ${activeTab.includes('orders') ? 'active' : ''}`}
            >
              <BiTask className="me-2" />
              Заказы
            </Link>
          </nav>
        </div>
      </div>
      <div className="admin-main-content">
        <Routes>
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="/" element={<Categories />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;