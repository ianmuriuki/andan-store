import express from 'express';
import { initiateMpesaPayment, mpesaCallback } from '../controllers/paymentController.js';

const router = express.Router();

// M-Pesa payment routes
router.post('/mpesa/initiate', initiateMpesaPayment);
router.post('/mpesa/callback', mpesaCallback);

export default router;