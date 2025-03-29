import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

// Регистрация пользователя
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {  // Исправлено API_URL на API_BASE_URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка при регистрации');
  }

  return data;
};

// Вход пользователя
export const loginUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/login`, {  // Исправлено API_URL на API_BASE_URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка при авторизации');
  }

  return data;
};

// Вход через GitHub
export const loginWithGitHub = async () => {
  try {
    window.location.href = `${API_BASE_URL}/github`;
  } catch (error) {
    throw error.response?.data || { message: "Ошибка при входе через GitHub." };
  }
};

// Выход пользователя
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/logout`);
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка при выходе.' };
  }
};

export const checkUserRole = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return { role: null };
    
    const response = await axios.get(`${API_BASE_URL}/check-role`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при проверке роли:', error);
    return { role: null };
  }
};