import axios from "axios";

// Базовый URL вашего backend-сервера
const API_BASE_URL = "http://localhost:5000/api/auth";

// Функция для регистрации пользователя
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Произошла ошибка при регистрации." };
  }
};

// Функция для входа пользователя
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Произошла ошибка при входе." };
  }
};