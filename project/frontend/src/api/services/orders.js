import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const createOrderRequest = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Требуется авторизация');
    }

    const response = await axios.post(
      `${API_BASE_URL}/orders/requests`, 
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order request:', error);
    throw new Error(error.response?.data?.message || error.message || 'Ошибка при создании заявки');
  }
};

export const getOrderRequests = async (status) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Требуется авторизация');
    }

    const response = await axios.get(`${API_BASE_URL}/orders/admin/requests`, {
      params: { status },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting order requests:', error);
    throw error;
  }
};

export const approveOrderRequest = async (orderId, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/orders/admin/requests/${orderId}/approve`,
      {
        adminComment: data.adminComment,
        subtopic: data.subtopic // Добавляем subtopic
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ошибка при одобрении заявки" };
  }
};
export const rejectOrderRequest = async (id, data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Требуется авторизация');
    }

    const response = await axios.put(`${API_BASE_URL}/orders/admin/requests/${id}/reject`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting order request:', error);
    throw error;
  }
};

export const updateOrderRequest = async (id, data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Требуется авторизация');
    }

    const response = await axios.put(`${API_BASE_URL}/orders/admin/requests/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order request:', error);
    throw error;
  }
};

export const fetchOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};

export const fetchOrdersByCategory = async (categoryId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/category/${categoryId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders by category:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const fetchOrders = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`, {
      params: { 
        page, 
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};

export const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id, orderData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${id}`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (id, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};