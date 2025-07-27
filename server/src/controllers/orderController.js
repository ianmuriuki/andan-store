import { Order } from '../models/Order.js';

// Create a new order (user)
export const createOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user.id,
    });
    // Fallback: set estimatedDelivery if not set
    if (!order.estimatedDelivery) {
      order.estimatedDelivery = new Date(Date.now() + 2 * 60 * 60 * 1000);
    }
    if (!order.orderNumber) {
      order.orderNumber = order.generateOrderNumber();
    }
    await order.save();
    res.status(201).json({ success: true, message: 'Order created', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get order by ID (user or admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'firstName lastName email');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cancel order (user or admin)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (!order.canBeCancelled()) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }
    order.status = 'cancelled';
    await order.save();
    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}; 