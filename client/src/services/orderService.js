import api from './api';

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  async getUserOrders(params = {}) {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  async getOrder(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status
  async updateOrderStatus(id, status) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancel order
  async cancelOrder(id, reason) {
    const response = await api.patch(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Get all orders (admin)
  async getAllOrders(params = {}) {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Export orders as CSV (admin)
  async exportOrdersCSV() {
    const response = await api.get('/orders/export', { responseType: 'blob' });
    return response.data;
  }
};