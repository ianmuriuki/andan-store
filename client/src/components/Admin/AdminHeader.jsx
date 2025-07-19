import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, User, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search:', searchQuery);
  };

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/admin" className="flex items-center space-x-3 group">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-card flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold text-lg font-playfair">A</span>
          </motion.div>
          <div>
            <span className="text-xl font-playfair font-bold text-neutral-800 group-hover:text-primary-500 transition-colors">
              Andan Admin
            </span>
            <p className="text-xs text-neutral-500 -mt-1">Dashboard</p>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, orders, users..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-button focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </form>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button 
            className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              3
            </span>
          </motion.button>

          {/* Back to Store */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/"
              className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:text-primary-500 transition-colors rounded-button hover:bg-neutral-50"
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:block">Store</span>
            </Link>
          </motion.div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-2 text-neutral-600 hover:text-neutral-900 transition-colors rounded-button hover:bg-neutral-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.firstName}</p>
                <p className="text-xs text-neutral-500">Administrator</p>
              </div>
            </motion.button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-card shadow-card-hover border border-neutral-100 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-primary-100">
                    <p className="font-medium text-neutral-800">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-neutral-600">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                      Administrator
                    </span>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center space-x-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-error-500 hover:bg-error-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;