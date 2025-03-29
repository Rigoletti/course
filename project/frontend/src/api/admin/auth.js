import adminApi from './index';

export const adminAuthApi = {
  // Проверить, является ли пользователь администратором
  checkAdmin: async () => {
    try {
      const response = await adminApi.get('/auth/check-role');
      if (response.data.role !== 'admin') {
        throw new Error('Access denied');
      }
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify admin role');
    }
  },

  // Получить список всех пользователей (если есть такой endpoint на бэкенде)
  getAllUsers: async () => {
    try {
      const response = await adminApi.get('/auth/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }
};