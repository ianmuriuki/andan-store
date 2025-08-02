import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, Tag, Percent, Gift, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const statusOptions = ['All', 'Active', 'Inactive', 'Expired'];

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setPromotions([
        {
          id: '1',
          name: 'New Year Special',
          code: 'NEWYEAR2024',
          type: 'percentage',
          value: 20,
          description: '20% off on all fruits and vegetables',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'active',
          usageCount: 145,
          usageLimit: 1000,
          minimumAmount: 500
        },
        {
          id: '2',
          name: 'Free Delivery',
          code: 'FREEDEL',
          type: 'free_shipping',
          value: 0,
          description: 'Free delivery on orders above KSH 1000',
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          status: 'active',
          usageCount: 89,
          usageLimit: 500,
          minimumAmount: 1000
        },
        {
          id: '3',
          name: 'First Time Buyer',
          code: 'WELCOME10',
          type: 'fixed_amount',
          value: 100,
          description: 'KSH 100 off for first-time customers',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'active',
          usageCount: 234,
          usageLimit: null,
          minimumAmount: 300
        },
        {
          id: '4',
          name: 'Christmas Sale',
          code: 'XMAS2023',
          type: 'percentage',
          value: 15,
          description: '15% off on all products',
          startDate: '2023-12-20',
          endDate: '2023-12-31',
          status: 'expired',
          usageCount: 567,
          usageLimit: 1000,
          minimumAmount: 200
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || statusFilter === 'All' || 
                         promotion.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter(p => p.id !== id));
      toast.success('Promotion deleted successfully');
    }
  };

  const handleAddNew = () => {
    setEditingPromotion(null);
    setShowModal(true);
  };

  const handleSavePromotion = (promotionData) => {
    if (editingPromotion) {
      setPromotions(promotions.map(p => p.id === editingPromotion.id ? { ...p, ...promotionData } : p));
      toast.success('Promotion updated successfully');
    } else {
      const newPromotion = {
        id: Date.now().toString(),
        ...promotionData,
        usageCount: 0
      };
      setPromotions([...promotions, newPromotion]);
      toast.success('Promotion created successfully');
    }
    setShowModal(false);
    setEditingPromotion(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'fixed_amount':
        return <Tag className="w-4 h-4" />;
      case 'free_shipping':
        return <Gift className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const promotionStats = [
    { label: 'Total Promotions', value: promotions.length, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Promotions', value: promotions.filter(p => p.status === 'active').length, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Usage', value: promotions.reduce((sum, p) => sum + p.usageCount, 0), color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Expired', value: promotions.filter(p => p.status === 'expired').length, color: 'text-red-600', bg: 'bg-red-100' },
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
          <h1 className="text-3xl font-bold text-neutral-800">Promotions</h1>
          <p className="text-neutral-600 mt-1">Manage discount codes and special offers</p>
        </div>
        <motion.button
          onClick={handleAddNew}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Promotion
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {promotionStats.map((stat, index) => (
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
              placeholder="Search promotions by name or code..."
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

      {/* Promotions Table */}
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
                  Promotion
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              <AnimatePresence>
                {filteredPromotions.map((promotion, index) => (
                  <motion.tr
                    key={promotion.id}
                    className="hover:bg-neutral-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{promotion.name}</div>
                        <div className="text-sm text-neutral-500">{promotion.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-mono bg-neutral-100 text-neutral-800 rounded-full">
                        {promotion.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(promotion.type)}
                        <span className="text-sm text-neutral-900 capitalize">
                          {promotion.type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {promotion.type === 'percentage' ? `${promotion.value}%` :
                       promotion.type === 'fixed_amount' ? `KSH ${promotion.value}` :
                       'Free Shipping'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {promotion.usageCount}
                      {promotion.usageLimit && ` / ${promotion.usageLimit}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(promotion.status)}`}>
                        {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleEdit(promotion)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(promotion.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Promotion Modal */}
      <PromotionModal
        show={showModal}
        promotion={editingPromotion}
        onClose={() => {
          setShowModal(false);
          setEditingPromotion(null);
        }}
        onSave={handleSavePromotion}
      />
    </div>
  );
};

// Promotion Modal Component
const PromotionModal = ({ show, promotion, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'active',
    usageLimit: '',
    minimumAmount: ''
  });

  useEffect(() => {
    if (promotion) {
      setFormData({
        name: promotion.name || '',
        code: promotion.code || '',
        type: promotion.type || 'percentage',
        value: promotion.value || '',
        description: promotion.description || '',
        startDate: promotion.startDate || '',
        endDate: promotion.endDate || '',
        status: promotion.status || 'active',
        usageLimit: promotion.usageLimit || '',
        minimumAmount: promotion.minimumAmount || ''
      });
    } else {
      setFormData({
        name: '',
        code: '',
        type: 'percentage',
        value: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'active',
        usageLimit: '',
        minimumAmount: ''
      });
    }
  }, [promotion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!show) return null;

  return (
    <AnimatePresence>
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
                {promotion ? 'Edit Promotion' : 'Create New Promotion'}
              </h2>
              <motion.button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Promotion Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter promotion name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Promotion Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter promotion code"
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed_amount">Fixed Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={formData.type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                    min="0"
                    required={formData.type !== 'free_shipping'}
                    disabled={formData.type === 'free_shipping'}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field h-24 resize-none"
                  placeholder="Enter promotion description"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Usage Limit (Optional)
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter usage limit"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Minimum Order Amount (KSH)
                  </label>
                  <input
                    type="number"
                    name="minimumAmount"
                    value={formData.minimumAmount}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter minimum amount"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-200">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {promotion ? 'Update Promotion' : 'Create Promotion'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminPromotions;