import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  User, 
  Phone,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  MoreVertical,
  Navigation,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDelivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('delivery'); // 'delivery' or 'driver'
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const statusOptions = ['All', 'Pending', 'Assigned', 'In Transit', 'Delivered', 'Failed'];

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setDeliveries([
        {
          id: 'DEL001',
          orderId: 'ORD-2024-001',
          customer: 'John Doe',
          address: '123 Main Street, Nairobi',
          phone: '+254 700 123 456',
          driver: 'James Mwangi',
          driverId: 'DRV001',
          status: 'in_transit',
          estimatedTime: '30 mins',
          actualTime: null,
          distance: '5.2 km',
          deliveryFee: 100,
          assignedAt: '2024-01-20 14:30',
          deliveredAt: null
        },
        {
          id: 'DEL002',
          orderId: 'ORD-2024-002',
          customer: 'Jane Smith',
          address: '456 Oak Avenue, Nairobi',
          phone: '+254 700 123 457',
          driver: 'Peter Kiprotich',
          driverId: 'DRV002',
          status: 'delivered',
          estimatedTime: '45 mins',
          actualTime: '42 mins',
          distance: '8.1 km',
          deliveryFee: 150,
          assignedAt: '2024-01-20 13:15',
          deliveredAt: '2024-01-20 13:57'
        },
        {
          id: 'DEL003',
          orderId: 'ORD-2024-003',
          customer: 'Mike Johnson',
          address: '789 Pine Road, Nairobi',
          phone: '+254 700 123 458',
          driver: null,
          driverId: null,
          status: 'pending',
          estimatedTime: '60 mins',
          actualTime: null,
          distance: '12.3 km',
          deliveryFee: 200,
          assignedAt: null,
          deliveredAt: null
        }
      ]);

      setDrivers([
        {
          id: 'DRV001',
          name: 'James Mwangi',
          phone: '+254 700 111 001',
          email: 'james@andangrocery.com',
          vehicle: 'Motorcycle - KCA 123A',
          status: 'busy',
          currentLocation: 'Westlands, Nairobi',
          totalDeliveries: 145,
          rating: 4.8,
          joinDate: '2023-06-15'
        },
        {
          id: 'DRV002',
          name: 'Peter Kiprotich',
          phone: '+254 700 111 002',
          email: 'peter@andangrocery.com',
          vehicle: 'Van - KBZ 456B',
          status: 'available',
          currentLocation: 'CBD, Nairobi',
          totalDeliveries: 203,
          rating: 4.9,
          joinDate: '2023-04-20'
        },
        {
          id: 'DRV003',
          name: 'Mary Wanjiku',
          phone: '+254 700 111 003',
          email: 'mary@andangrocery.com',
          vehicle: 'Motorcycle - KCD 789C',
          status: 'offline',
          currentLocation: 'Kasarani, Nairobi',
          totalDeliveries: 89,
          rating: 4.7,
          joinDate: '2023-08-10'
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || statusFilter === 'All' || 
                         delivery.status === statusFilter.toLowerCase().replace(' ', '_');
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDriverStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-orange-100 text-orange-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignDriver = (deliveryId, driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    setDeliveries(deliveries.map(delivery => 
      delivery.id === deliveryId 
        ? { 
            ...delivery, 
            driver: driver.name, 
            driverId: driverId,
            status: 'assigned',
            assignedAt: new Date().toISOString()
          } 
        : delivery
    ));
    toast.success('Driver assigned successfully');
  };

  const deliveryStats = [
    { label: 'Total Deliveries', value: deliveries.length, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending', value: deliveries.filter(d => d.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'In Transit', value: deliveries.filter(d => d.status === 'in_transit').length, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Delivered Today', value: deliveries.filter(d => d.status === 'delivered').length, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="loading-skeleton h-32 rounded-card"></div>
          ))}
        </div>
        <div className="loading-skeleton h-96 rounded-card"></div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-neutral-800">Delivery Management</h1>
          <p className="text-neutral-600 mt-1">Track deliveries and manage delivery drivers</p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => {
              setModalType('driver');
              setEditingItem(null);
              setShowModal(true);
            }}
            className="btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Driver
          </motion.button>
          <motion.button 
            className="btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Track All
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {deliveryStats.map((stat, index) => (
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

      {/* Delivery Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Deliveries */}
        <div className="lg:col-span-2">
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-800">Active Deliveries</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search deliveries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 w-64"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field w-40"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status === 'All' ? '' : status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredDeliveries.map((delivery, index) => (
                <motion.div
                  key={delivery.id}
                  className="border border-neutral-200 rounded-card p-4 hover:shadow-card transition-shadow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-800">{delivery.orderId}</h3>
                        <p className="text-sm text-neutral-600">{delivery.customer}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                      {delivery.status.replace('_', ' ').charAt(0).toUpperCase() + delivery.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <MapPin className="w-4 h-4" />
                      <span>{delivery.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Phone className="w-4 h-4" />
                      <span>{delivery.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Clock className="w-4 h-4" />
                      <span>ETA: {delivery.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Truck className="w-4 h-4" />
                      <span>{delivery.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {delivery.driver ? (
                        <>
                          <User className="w-4 h-4 text-neutral-600" />
                          <span className="text-sm font-medium text-neutral-800">{delivery.driver}</span>
                        </>
                      ) : (
                        <span className="text-sm text-neutral-500">No driver assigned</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {!delivery.driver && (
                        <select
                          onChange={(e) => handleAssignDriver(delivery.id, e.target.value)}
                          className="text-xs border border-neutral-200 rounded px-2 py-1"
                          defaultValue=""
                        >
                          <option value="">Assign Driver</option>
                          {drivers.filter(d => d.status === 'available').map(driver => (
                            <option key={driver.id} value={driver.id}>
                              {driver.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <motion.button
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Drivers Panel */}
        <div className="lg:col-span-1">
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-800">Drivers</h2>
              <span className="text-sm text-neutral-600">{drivers.filter(d => d.status === 'available').length} available</span>
            </div>

            <div className="space-y-4">
              {drivers.map((driver, index) => (
                <motion.div
                  key={driver.id}
                  className="border border-neutral-200 rounded-card p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {driver.name.split(' ').map(n => n.charAt(0)).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-800">{driver.name}</h3>
                        <p className="text-xs text-neutral-600">{driver.vehicle}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDriverStatusColor(driver.status)}`}>
                      {driver.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-neutral-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3" />
                      <span>{driver.currentLocation}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>{driver.totalDeliveries} deliveries</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>⭐ {driver.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-3 space-x-2">
                    <motion.button
                      onClick={() => {
                        setModalType('driver');
                        setEditingItem(driver);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className="text-neutral-600 hover:text-neutral-900 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal for Driver Management */}
      <AnimatePresence>
        {showModal && modalType === 'driver' && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-card shadow-card-hover w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-800">
                    {editingItem ? 'Edit Driver' : 'Add New Driver'}
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
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Enter driver name"
                        defaultValue={editingItem?.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="input-field"
                        placeholder="+254 700 123 456"
                        defaultValue={editingItem?.phone}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="Enter email address"
                      defaultValue={editingItem?.email}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Vehicle Information
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g., Motorcycle - KCA 123A"
                      defaultValue={editingItem?.vehicle}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Status
                    </label>
                    <select
                      className="input-field"
                      defaultValue={editingItem?.status || 'available'}
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </form>
                
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-neutral-200">
                  <motion.button
                    onClick={() => setShowModal(false)}
                    className="btn-ghost"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setShowModal(false);
                      toast.success(editingItem ? 'Driver updated successfully' : 'Driver added successfully');
                    }}
                    className="btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingItem ? 'Update Driver' : 'Add Driver'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDelivery;