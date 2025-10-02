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
        
        // FIX: Access the CheckoutRequestID with correct casing.
        const checkoutID = response.data.CheckoutRequestID;

        if (!checkoutID) {
          // Safety check in case M-Pesa returns success but with an odd response structure
          toast.error('Failed to get transaction ID from M-Pesa.');
          throw new Error('Missing CheckoutRequestID');
        }

        // Start polling for payment status using the correctly extracted ID
        pollPaymentStatus(checkoutID);
        
        return response.data;
      } else {
        // Ensure error response message is shown correctly
        throw new Error(response.message || 'Payment initiation failed.');
      }
    } catch (error) {
      // Improved error logging
      console.error('Initiate M-Pesa Payment error:', error);
      toast.error(error.message || 'Payment initiation failed. Check console for details.');
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
        
        // M-Pesa status query returns '0' on success, '17' on canceled, '1032' on pending.
        if (response.data.ResultCode === '0') {
          // Payment successful
          setPaymentStatus('completed');
          toast.success('Payment completed successfully!');
          return;
        } else if (response.data.ResultCode !== '1032') {
          // Payment failed (e.g., canceled by user, 1032 means still pending)
          setPaymentStatus('failed');
          toast.error('Payment failed. Please try again or check your M-Pesa PIN.');
          return;
        }

        // Continue polling if still pending
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setPaymentStatus('timeout');
          toast.error('Payment timeout. Please check your M-Pesa messages and status.');
        }
      } catch (error) {
        console.error('Payment status polling error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          // Continue polling despite API errors, in case of temporary network issue
          setTimeout(poll, 10000);
        } else {
          setPaymentStatus('error');
          toast.error('Payment verification error.');
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
