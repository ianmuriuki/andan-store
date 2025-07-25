import { useState } from 'react';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const initiateMpesaPayment = async (orderId, phoneNumber) => {
    setIsProcessing(true);
    try {
      const response = await paymentService.initiateMpesaPayment(orderId, phoneNumber);
      
      if (response.success) {
        toast.success('Payment request sent to your phone');
        
        // Start polling for payment status
        pollPaymentStatus(response.data.checkoutRequestID);
        
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(error.message || 'Payment initiation failed');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestID) => {
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await paymentService.queryPaymentStatus(checkoutRequestID);
        
        if (response.data.ResultCode === '0') {
          // Payment successful
          setPaymentStatus('completed');
          toast.success('Payment completed successfully!');
          return;
        } else if (response.data.ResultCode !== '1032') {
          // Payment failed (1032 means still pending)
          setPaymentStatus('failed');
          toast.error('Payment failed. Please try again.');
          return;
        }

        // Continue polling if still pending
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setPaymentStatus('timeout');
          toast.error('Payment timeout. Please check your M-Pesa messages.');
        }
      } catch (error) {
        console.error('Payment status polling error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        }
      }
    };

    poll();
  };

  return {
    initiateMpesaPayment,
    isProcessing,
    paymentStatus,
    setPaymentStatus
  };
};