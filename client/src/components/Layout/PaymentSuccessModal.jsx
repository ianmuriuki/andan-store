import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { usePayment } from "../../contexts/PaymentContext";
import { useNavigate } from "react-router-dom";

const PaymentSuccessModal = () => {
  const { showSuccessModal, closeSuccessModal } = usePayment();
  const navigate = useNavigate();

  const handleClose = () => {
    closeSuccessModal();
  };

  const handleGoToOrders = () => {
    closeSuccessModal();
    navigate("/orders");
  };

  return (
    <AnimatePresence>
      {showSuccessModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              className="mx-auto bg-green-100 rounded-full h-24 w-24 flex items-center justify-center border-4 border-green-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 400,
                damping: 15,
              }}
            >
              <CheckCircle className="text-green-600 w-12 h-12" />
            </motion.div>

            <motion.h2
              className="text-3xl font-bold text-neutral-800 mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Payment Successful!
            </motion.h2>

            <motion.p
              className="text-neutral-600 mt-3 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your order has been confirmed. Hold on tight, your delivery is on
              its way!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleGoToOrders}
                className="btn-primary w-full py-3"
              >
                Track Your Order
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentSuccessModal;
