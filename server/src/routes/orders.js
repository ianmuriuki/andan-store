import express from 'express';
import { body, param } from 'express-validator';
import mongoose from 'mongoose';
import { createOrder, getOrderById, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('paymentInfo').isObject().withMessage('Payment info is required'),
];

// @route   POST /api/orders
// @desc    Create new order (user)
// @access  Private
router.post('/', auth, orderValidation, validate, createOrder);

// @route   GET /api/orders
// @desc    Get all orders (admin)
// @access  Admin
router.get('/', adminAuth, getAllOrders);

// @route   GET /api/orders/my
// @desc    Get current user's orders
// @access  Private
router.get('/my', auth, getUserOrders);

// @route   GET /api/orders/export
// @desc    Export all orders as CSV (admin)
// @access  Admin
router.get('/export', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'firstName lastName email');
    const fields = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Status',
      'Total Price',
      'Created At',
      'Items',
      'Shipping Address',
      'Payment Method',
    ];
    const csvRows = [fields.join(',')];
    for (const order of orders) {
      const row = [
        order.orderNumber,
        order.user ? `${order.user.firstName} ${order.user.lastName}` : '',
        order.user ? order.user.email : '',
        order.status,
        order.totalPrice,
        order.createdAt.toISOString(),
        order.items.map(i => `${i.name} (x${i.quantity})`).join('; '),
        order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}` : '',
        order.paymentInfo ? order.paymentInfo.method : '',
      ];
      csvRows.push(row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    }
    const csv = csvRows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID (user or admin)
// @access  Private/Admin
router.get('/:id', auth, param('id').isMongoId(), validate, getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin)
// @access  Admin
router.put('/:id/status', adminAuth, param('id').isMongoId(), body('status').isIn(['pending','confirmed','processing','shipped','delivered','cancelled']), validate, updateOrderStatus);

// @route   DELETE /api/orders/:id
// @desc    Cancel order (user or admin)
// @access  Private/Admin
router.delete('/:id', auth, param('id').isMongoId(), validate, cancelOrder);

export default router; 