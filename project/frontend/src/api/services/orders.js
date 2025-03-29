import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/orders';

export const fetchOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
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
    const response = await axios.get(`${API_BASE_URL}/category/${categoryId}`, {
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
    const response = await axios.get(API_BASE_URL, {
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
    const response = await axios.post(API_BASE_URL, orderData, {
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
    const response = await axios.put(`${API_BASE_URL}/${id}`, orderData, {
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
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
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