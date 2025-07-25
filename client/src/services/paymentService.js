import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const paymentService = {
  // Initiate M-Pesa payment
  async initiateMpesaPayment(orderId, phoneNumber) {
    try {
      const response = await axios.post(`${API_URL}/payments/mpesa/initiate`, {
        orderId,
        phoneNumber
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Query payment status
  async queryPaymentStatus(checkoutRequestID) {
    try {
      const response = await axios.get(`${API_URL}/payments/mpesa/status/${checkoutRequestID}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};