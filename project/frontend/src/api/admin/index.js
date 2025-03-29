import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Добавляем интерцептор для авторизации
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Перенаправляем на страницу авторизации, если нет токена
    window.location.href = '/authorization';
  }
  return config;
});

// Интерцептор для проверки роли администратора
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/authorization';
    }
    
    if (error.response?.status === 403) {
      // Если доступ запрещен (не админ)
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default adminApi;