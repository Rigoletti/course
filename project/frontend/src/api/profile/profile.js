import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/profile";

// Получение данных профиля
export const fetchProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ошибка при получении профиля." };
  }
};

// Обновление данных профиля
export const updateProfile = async (token, profileData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ошибка при обновлении профиля." };
  }
};

// Загрузка аватарки
export const uploadAvatar = async (token, file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.post(`${API_BASE_URL}/upload-avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ошибка при загрузке аватарки." };
  }
};