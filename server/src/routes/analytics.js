import express from 'express';
import {
  getDashboardStats,
  getSalesAnalytics,
  getCustomerAnalytics,
  getProductAnalytics
} from '../controllers/analyticsController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin analytics routes
router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/sales', adminAuth, getSalesAnalytics);
router.get('/customers', adminAuth, getCustomerAnalytics);
router.get('/products', adminAuth, getProductAnalytics);

export default router;