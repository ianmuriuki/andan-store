import express from 'express';
import { initiateMpesaPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/mpesa/initiate', initiateMpesaPayment);

export default router;