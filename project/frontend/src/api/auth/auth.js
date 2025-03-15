import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

// Регистрация пользователя
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Произошла ошибка при регистрации." };
  }
};

// Вход пользователя
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Произошла ошибка при входе." };
  }
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
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ошибка при выходе." };
  }
};