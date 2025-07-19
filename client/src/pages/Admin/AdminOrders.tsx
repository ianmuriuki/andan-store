import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Search, Filter, Download, MoreVertical, Package, Truck, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
  paymentMethod: string;
  deliveryAddress: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      customer: 'John Doe',
      email: 'john@example.com',
      total: 1250.50,
      status: 'delivered',
      date: '2024-01-15',
      items: 3,
      paymentMethod: 'M-Pesa',
      deliveryAddress: '123 Main St, Nairobi'
    },
    {
      id: 'ORD002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      total: 850.75,
      status: 'processing',
      date: '2024-01-14',
      items: 2,
      paymentMethod: 'M-Pesa',
      deliveryAddress: '456 Oak Ave, Nairobi'
    },
    {
      id: 'ORD003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      total: 2100.00,
      status: 'shipped',
      date: '2024-01-13',
      items: 5,
      paymentMethod: 'M-Pesa',
      deliveryAddress: '789 Pine Rd, Nairobi'
    },
    {
      id: 'ORD004',
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      total: 750.25,
      status: 'pending',
      date: '2024-01-12',
      items: 1,
      paymentMethod: 'M-Pesa',
      deliveryAddress: '321 Elm St, Nairobi'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || statusFilter === 'All' || 
                         order.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Package className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const orderStats = [
    { label: 'Total Orders', value: orders.length, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Orders</h1>
          <p className="text-neutral-600 mt-1">Manage and track all customer orders</p>
        </div>
        <motion.button 
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Orders
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {orderStats.map((stat, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-card`}>
                <div className={`w-6 h-6 ${stat.color} rounded-full`}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
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
            {statusOptions.map(status => (
              <option key={status} value={status === 'All' ? '' : status}>
                {status}
              </option>
            ))}
          </select>
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div 
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    className="hover:bg-neutral-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{order.customer}</div>
                        <div className="text-sm text-neutral-500">{order.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {order.items} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      KSH {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                        className={`px-3 py-1 text-xs font-medium rounded-full border-none focus:ring-2 focus:ring-primary-500 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          className="text-neutral-600 hover:text-neutral-900 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
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
                    Order Details - {selectedOrder.id}
                  </h2>
                  <motion.button
                    onClick={() => setShowModal(false)}
                    className="text-neutral-500 hover:text-neutral-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Customer Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-neutral-600">Name:</span>
                        <p className="font-medium">{selectedOrder.customer}</p>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-600">Email:</span>
                        <p className="font-medium">{selectedOrder.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-600">Phone:</span>
                        <p className="font-medium">+254 700 123 456</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Order Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-neutral-600">Order ID:</span>
                        <p className="font-medium">{selectedOrder.id}</p>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-600">Date:</span>
                        <p className="font-medium">{selectedOrder.date}</p>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-600">Status:</span>
                        <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-600">Payment Method:</span>
                        <p className="font-medium">{selectedOrder.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-neutral-800">Delivery Address</h3>
                  <p className="text-neutral-700">{selectedOrder.deliveryAddress}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-neutral-800">Order Items</h3>
                  <div className="border rounded-card overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        <tr>
                          <td className="px-4 py-3">Fresh Organic Apples</td>
                          <td className="px-4 py-3">2 kg</td>
                          <td className="px-4 py-3">KSH 299.00</td>
                          <td className="px-4 py-3">KSH 598.00</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">Farm Fresh Milk</td>
                          <td className="px-4 py-3">1 liter</td>
                          <td className="px-4 py-3">KSH 120.00</td>
                          <td className="px-4 py-3">KSH 120.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-neutral-600">Subtotal:</span>
                    <span className="font-medium">KSH {(selectedOrder.total - 100 - (selectedOrder.total * 0.16)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-neutral-600">Delivery Fee:</span>
                    <span className="font-medium">KSH 100.00</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-neutral-600">Tax (16%):</span>
                    <span className="font-medium">KSH {(selectedOrder.total * 0.16).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
                    <span>Total:</span>
                    <span>KSH {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;