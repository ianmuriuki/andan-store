import api from './api';

export const productService = {
  // Get all products with filters
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
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
  }
};