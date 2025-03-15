import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api/auth";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Произошла ошибка при регистрации." };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Произошла ошибка при входе." };
  }
};