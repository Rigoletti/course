import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrdersByCategory } from '../../api/services/orders';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../../assets/style/orders/Orders.css";

const Order = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrdersByCategory(categoryId, currentPage, 10);
        
        if (data && (data.success || data.orders)) {
          setOrders(data.orders || []);
          setTotalPages(data.totalPages || 1);
          setError(null);
        } else {
          throw new Error(data?.message || 'Failed to load orders');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [categoryId, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Загружаем заказы...</p>
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
          <i className="bi bi-arrow-left me-2"></i>
          Вернуться назад
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-3">
        <div className="col">
          <button 
            onClick={handleBack}
            className="btn btn-outline-secondary"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Назад
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-gradient mb-1">Доступные заказы</h2>
          <p className="text-muted">Выберите интересующий вас заказ</p>
        </div>
      </div>
      
      {orders && orders.length > 0 ? (
        <>
          <div className="row g-4">
            {orders.map(order => (
              <div key={order._id} className="col-md-6 col-lg-4">
                <div 
                  className="card h-100 shadow-sm border-0 hover-shadow transition-all"
                  onClick={() => handleOrderClick(order._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title fw-bold text-truncate">{order.title}</h5>
                      <span className="badge bg-success bg-opacity-10 text-success fs-6">
                        {order.price?.toLocaleString()}₽
                      </span>
                    </div>
                    
                    <p className="card-text text-muted flex-grow-1">
                      {order.description?.length > 100 
                        ? `${order.description.substring(0, 100)}...` 
                        : order.description}
                    </p>
                    
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`badge ${order.daysLeft > 3 ? 'bg-info' : 'bg-warning'} text-dark`}>
                          <i className="bi bi-clock me-1"></i>
                          {order.daysLeft} {order.daysLeft === 1 ? 'день' : order.daysLeft < 5 ? 'дня' : 'дней'} осталось
                        </span>
                        <button className="btn btn-sm btn-outline-primary">
                          Подробнее
                        </button>
                      </div>
                    </div>
                    
                    {order.skills?.length > 0 && (
                      <div className="mt-3 pt-2 border-top">
                        <div className="d-flex flex-wrap gap-1">
                          {order.skills.map((skill, i) => (
                            <span key={i} className="badge bg-light text-dark border">
                              <i className="bi bi-tag me-1"></i>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="row mt-5">
              <div className="col">
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-label="Previous"
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-label="Next"
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="row">
          <div className="col">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">В этой категории пока нет заказов</h5>
                <p className="text-muted">Попробуйте проверить позже или посмотрите другие категории</p>
                <button onClick={handleBack} className="btn btn-primary mt-3">
                  <i className="bi bi-arrow-left me-2"></i>
                  Вернуться назад
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;