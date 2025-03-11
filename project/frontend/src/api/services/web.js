import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/orders'; 

// Получить все заказы
export const fetchOrders = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    throw error;
  }
};

// Создать заказ (для админа)
export const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post(API_BASE_URL, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    throw error;
  }
};

// Обновить заказ (для админа)
export const updateOrder = async (id, orderData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении заказа:', error);
    throw error;
  }
};

// Удалить заказ (для админа)
export const deleteOrder = async (id, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении заказа:', error);
    throw error;
  }
};