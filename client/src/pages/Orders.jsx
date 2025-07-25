import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  X, 
  Eye, 
  RotateCcw,
  Star,
  MessageCircle,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { orderService } from '../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getUserOrders();
      setOrders(res.data || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = (order.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.items || []).some(item => (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-main section-padding">
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="loading-skeleton h-32 rounded-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main section-padding">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-heading text-4xl font-bold text-neutral-800 mb-4">
            My Orders
          </h1>
          <p className="text-neutral-600 text-xl">
            Track and manage your grocery orders
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by number or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-search"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field md:w-48"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  className="card hover:shadow-card-hover cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => handleViewOrder(order)}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-neutral-600">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                        Order {order.orderNumber}
                      </h3>

                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-neutral-600">
                          {order.items ? order.items.length : 0} {order.items && order.items.length === 1 ? 'item' : 'items'}
                        </span>
                        <span className="text-2xl font-bold text-primary-500">
                          KSH {(order.totalPrice ?? 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Order Items Preview */}
                      <div className="flex items-center space-x-2 mb-4">
                        {(order.items || []).slice(0, 3).map((item, itemIndex) => (
                          <img
                            key={item._id || itemIndex}
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-card"
                          />
                        ))}
                        {order.items && order.items.length > 3 && (
                          <div className="w-12 h-12 bg-neutral-100 rounded-card flex items-center justify-center text-sm font-medium text-neutral-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      <p className="text-neutral-600 text-sm">
                        Delivery to: {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}` : ''}
                      </p>

                      {order.estimatedDelivery && order.status !== 'delivered' && (
                        <p className="text-primary-500 text-sm font-medium mt-1">
                          Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </p>
                      )}

                      {order.trackingNumber && (
                        <p className="text-neutral-600 text-sm mt-1">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(order);
                        }}
                        className="btn-secondary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </motion.button>

                      {/* Add cancel/reorder logic here if needed */}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Package className="w-16 h-16 text-neutral-400" />
            </div>
            <h2 className="text-heading text-2xl font-bold text-neutral-800 mb-4">
              No orders found
            </h2>
            <p className="text-neutral-600 text-xl mb-8 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'No orders match your current filters. Try adjusting your search criteria.'
                : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'
              }
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/products" className="btn-primary">
                Start Shopping
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {showOrderDetails && selectedOrder && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-card shadow-card-hover w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-800">
                      Order Details - {selectedOrder.orderNumber}
                    </h2>
                    <motion.button
                      onClick={() => setShowOrderDetails(false)}
                      className="text-neutral-500 hover:text-neutral-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Order Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-neutral-800">Order Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Order Number:</span>
                          <span className="font-medium">{selectedOrder.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Date:</span>
                          <span className="font-medium">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : ''}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-600">Status:</span>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </span>
                        </div>
                        {selectedOrder.trackingNumber && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Tracking:</span>
                            <span className="font-medium">{selectedOrder.trackingNumber}</span>
                          </div>
                        )}
                        {selectedOrder.estimatedDelivery && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Estimated Delivery:</span>
                            <span className="font-medium">{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-neutral-800">Delivery Address</h3>
                      <p className="text-neutral-700">{selectedOrder.shippingAddress ? `${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}` : ''}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Order Items</h3>
                    <div className="space-y-4">
                      {(selectedOrder.items || []).map((item, idx) => (
                        <div key={item._id || idx} className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-card">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-card"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-800">{item.name}</h4>
                            <p className="text-sm text-neutral-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-neutral-800">
                              KSH {(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-neutral-600">
                              KSH {item.price} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="border-t pt-6 mb-8">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary-500">KSH {(selectedOrder.totalPrice ?? 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      className="btn-secondary flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </motion.button>

                    {/* Add more actions as needed */}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;