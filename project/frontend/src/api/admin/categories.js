import adminApi from './index';

export const adminCategoriesApi = {
  getAll: async () => {
    try {
      const response = await adminApi.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка при загрузке категорий');
    }
  },

  getById: async (id) => {
    try {
      const response = await adminApi.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка при загрузке категории');
    }
  },

  create: async (formData) => {
    try {
      const response = await adminApi.post('/categories', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Ошибка при создании категории';
      const errors = error.response?.data?.errors;
      
      throw errors 
        ? { message: errorMsg, errors } 
        : new Error(errorMsg);
    }
  },

  update: async (id, formData) => {
    try {
      const response = await adminApi.put(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json' // Изменено с multipart/form-data
        }
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Ошибка при обновлении категории';
      const errors = error.response?.data?.errors;
      
      throw errors 
        ? { message: errorMsg, errors } 
        : new Error(errorMsg);
    }
  },

  delete: async (id) => {
    try {
      const response = await adminApi.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка при удалении категории');
    }
  },

  getStats: async (id) => {
    try {
      const response = await adminApi.get(`/categories/${id}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка при загрузке статистики');
    }
  }
};