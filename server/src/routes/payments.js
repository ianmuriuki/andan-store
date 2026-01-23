import express from "express";
import {
  initiateMpesaPayment,
  mpesaCallback,
  queryPaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

// M-Pesa payment routes
router.post("/mpesa/initiate", initiateMpesaPayment);
router.post("/mpesa/callback", mpesaCallback);
router.get("/mpesa/status/:checkoutRequestID", queryPaymentStatus);

export default router;
