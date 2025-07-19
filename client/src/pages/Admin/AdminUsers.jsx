import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Mail, Phone, Edit, Trash2, UserPlus, MoreVertical, Shield, User } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+254 700 123 456',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      totalOrders: 12,
      totalSpent: 15450.50
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+254 700 123 457',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-10',
      totalOrders: 8,
      totalSpent: 8750.75
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike@example.com',
      phone: '+254 700 123 458',
      role: 'user',
      status: 'inactive',
      joinDate: '2024-01-05',
      totalOrders: 5,
      totalSpent: 3200.00
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const roleOptions = ['All', 'User', 'Admin'];
  const statusOptions = ['All', 'Active', 'Inactive'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || roleFilter === 'All' || 
                       user.role === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === '' || statusFilter === 'All' || 
                         user.status === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleStatusToggle = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
  };

  const userStats = [
    { label: 'Total Users', value: users.length, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Users', value: users.filter(u => u.status === 'active').length, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Admin Users', value: users.filter(u => u.role === 'admin').length, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'New This Month', value: 12, color: 'text-orange-600', bg: 'bg-orange-100' },
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
          <h1 className="text-3xl font-bold text-neutral-800">Users</h1>
          <p className="text-neutral-600 mt-1">Manage customer accounts and administrators</p>
        </div>
        <motion.button
          onClick={handleAddNew}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
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
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-search"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field md:w-48"
          >
            {roleOptions.map(role => (
              <option key={role} value={role === 'All' ? '' : role}>
                {role}
              </option>
            ))}
          </select>
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

      {/* Users Table */}
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
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    className="hover:bg-neutral-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-semibold text-sm">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-neutral-500">
                            Joined {user.joinDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{user.email}</div>
                      <div className="text-sm text-neutral-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? (
                          <div className="flex items-center space-x-1">
                            <Shield className="w-3 h-3" />
                            <span>Admin</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>Customer</span>
                          </div>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        onClick={() => handleStatusToggle(user.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {user.status}
                      </motion.button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {user.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      KSH {user.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal for Add/Edit User */}
      <AnimatePresence>
        {showModal && (
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
                    {editingUser ? 'Edit User' : 'Add New User'}
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
                        First Name
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Enter first name"
                        defaultValue={editingUser?.firstName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Enter last name"
                        defaultValue={editingUser?.lastName}
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
                      defaultValue={editingUser?.email}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="Enter phone number"
                      defaultValue={editingUser?.phone}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Role
                      </label>
                      <select
                        className="input-field"
                        defaultValue={editingUser?.role}
                      >
                        <option value="user">Customer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Status
                      </label>
                      <select
                        className="input-field"
                        defaultValue={editingUser?.status}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        className="input-field"
                        placeholder="Enter password"
                      />
                    </div>
                  )}
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
                    onClick={() => setShowModal(false)}
                    className="btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingUser ? 'Update User' : 'Add User'}
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

export default AdminUsers;