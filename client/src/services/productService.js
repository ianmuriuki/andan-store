import api from './api';

export const productService = {
  // Get all products with filters
  async getProducts(params = {}) {
    // Remove empty, null, or undefined params
    const filteredParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
        filteredParams[key] = params[key];
      }
    });

    const response = await api.get('/products', { params: filteredParams });
    return response.data;
  },

  // Get single product
  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get featured products
  async getFeaturedProducts() {
    const response = await api.get('/products/featured');
    return response.data;
  },

  // Search products
  async searchProducts(query, params = {}) {
    const response = await api.get('/products/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  // Get products by category
  async getProductsByCategory(category, params = {}) {
    const response = await api.get(`/products/category/${category}`, { params });
    return response.data;
  },

  // Add product review
  async addReview(productId, reviewData) {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  },

  // Create product (Admin)
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (Admin)
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (Admin)
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};