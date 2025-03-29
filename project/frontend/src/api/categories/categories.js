import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/categories";

// Получение всех категорий
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ошибка при получении категорий." };
  }
};

// Получение одной категории по ID
export const fetchCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ошибка при получении категории." };
  }
};

// Создание новой категории
export const createCategory = async (token, categoryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ошибка при создании категории." };
  }
};