import React, { createContext, useState, useContext } from "react";
import { paymentService } from "../services/paymentService";
import toast from "react-hot-toast";

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const initiateMpesaPayment = async (orderId, phoneNumber) => {
    setIsProcessing(true);
    setPaymentStatus("processing");
    try {
      const response = await paymentService.initiateMpesaPayment(
        orderId,
        phoneNumber,
      );

      if (response.success) {
        toast.success("Payment request sent to your phone. Please approve the transaction.");

        const checkoutID = response.data.CheckoutRequestID;

        if (!checkoutID) {
          toast.error("Failed to get transaction ID from M-Pesa.");
          throw new Error("Missing CheckoutRequestID");
        }

        pollPaymentStatus(checkoutID);

        return response.data;
      } else {
        throw new Error(response.message || "Payment initiation failed.");
      }
    } catch (error) {
      console.error("Initiate M-Pesa Payment error:", error);
      toast.error(
        error.message ||
          "Payment initiation failed. Check console for details.",
      );
      setPaymentStatus("failed");
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestID) => {
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0;
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 5;

    const poll = async () => {
      try {
        const response =
          await paymentService.queryPaymentStatus(checkoutRequestID);

        consecutiveErrors = 0;

        if (response.data.ResultCode === "0") {
          setPaymentStatus("completed");
          setShowSuccessModal(true); // Show the success modal
          return;
        } else if (response.data.ResultCode !== "1032") {
          setPaymentStatus("failed");
          toast.error(
            response.data.ResultDesc || "Payment failed. Please try again.",
          );
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        } else {
          setPaymentStatus("timeout");
          toast.error(
            "Payment timeout. Please check your M-Pesa messages.",
          );
        }
      } catch (error) {
        console.error("Payment status polling error:", error);
        consecutiveErrors++;
        attempts++;

        if (consecutiveErrors >= maxConsecutiveErrors) {
          setPaymentStatus("error");
          toast.error(
            "Unable to verify payment status. Please contact support if payment was made.",
          );
          return;
        }

        if (attempts < maxAttempts) {
          const delay = 10000 * (1 + consecutiveErrors * 0.5);
          setTimeout(poll, delay);
        } else {
          setPaymentStatus("error");
          toast.error(
            "Payment verification error. Please check your M-Pesa messages.",
          );
        }
      }
    };

    poll();
  };
  
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setPaymentStatus(null); 
  };

  const value = {
    isProcessing,
    paymentStatus,
    showSuccessModal,
    initiateMpesaPayment,
    closeSuccessModal,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
