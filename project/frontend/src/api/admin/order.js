import adminApi from './index';

export const adminOrdersApi = {
  // Получить все заказы с пагинацией и фильтрами
  getAll: async (params = {}) => {
    try {
      const response = await adminApi.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // Получить заказ по ID
  getById: async (id) => {
    try {
      const response = await adminApi.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  // Создать новый заказ
  create: async (orderData) => {
    try {
      const response = await adminApi.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  // Обновить заказ
  update: async (id, orderData) => {
    try {
      const response = await adminApi.put(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order');
    }
  },

  // Удалить заказ
  delete: async (id) => {
    try {
      const response = await adminApi.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete order');
    }
  },

  // Получить заказы по категории
  getByCategory: async (categoryId) => {
    try {
      const response = await adminApi.get(`/orders/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders by category');
    }
  },

  // Получить заказы по подразделу
  getBySubtopic: async (categoryId, subtopic) => {
    try {
      const response = await adminApi.get(`/orders/category/${categoryId}/subtopic/${subtopic}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders by subtopic');
    }
  }
};