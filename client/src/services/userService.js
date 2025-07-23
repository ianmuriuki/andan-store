import api from './api';

export const userService = {
  // Get all users (admin)
  async getUsers(params = {}) {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get single user by ID (admin)
  async getUser(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user (admin)
  async createUser(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user (admin)
  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (admin)
  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Update current user's profile
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change current user's password
  async changePassword(passwordData) {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Upload avatar image
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
}; 