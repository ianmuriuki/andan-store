import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  LogOut, 
  Heart,
  Package,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const cartCount = getCartCount();

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-card border-b border-neutral-100' 
          : 'bg-white border-b border-neutral-100'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container-main">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-card flex items-center justify-center shadow-button"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-xl font-playfair">A</span>
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-2xl font-playfair font-bold text-neutral-800 group-hover:text-primary-500 transition-colors">
                Andan
              </span>
              <p className="text-sm text-neutral-500 -mt-1">Fresh Groceries</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for fresh groceries, fruits, vegetables..."
                className="w-full pl-12 pr-6 py-4 border border-neutral-200 rounded-card focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-body bg-neutral-50 hover:bg-white focus:bg-white"
              />
              <motion.button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white px-4 py-2 rounded-button hover:bg-primary-600 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Search
              </motion.button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/products" 
              className="text-neutral-700 hover:text-primary-500 transition-colors duration-200 font-medium text-body relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            
            {/* Wishlist */}
            <motion.button 
              className="relative p-2 text-neutral-700 hover:text-primary-500 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-accent-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                0
              </span>
            </motion.button>
            
            {/* Cart */}
            <Link to="/cart" className="relative group">
              <motion.div
                className="p-2 text-neutral-700 hover:text-primary-500 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="w-6 h-6" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      key={cartCount}
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-card hover:bg-neutral-50 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-medium text-neutral-800">{user.firstName}</p>
                    <p className="text-xs text-neutral-500">My Account</p>
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-card shadow-card-hover border border-neutral-100 overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-primary-100">
                        <p className="font-medium text-neutral-800">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-neutral-600">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                          {user.role === 'admin' ? 'Admin' : 'Customer'}
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
                          to="/orders"
                          className="flex items-center space-x-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          <span>Order History</span>
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
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
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-neutral-700 hover:text-primary-500 transition-colors duration-200 font-medium"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/register" className="btn-primary">
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-primary-500 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-neutral-100 py-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search groceries..."
                    className="w-full pl-12 pr-4 py-4 border border-neutral-200 rounded-card focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-neutral-50"
                  />
                </form>

                <Link
                  to="/products"
                  className="text-neutral-700 hover:text-primary-500 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Products
                </Link>
                
                <Link
                  to="/cart"
                  className="flex items-center space-x-3 text-neutral-700 hover:text-primary-500 transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Shopping Cart ({cartCount})</span>
                </Link>

                {user ? (
                  <>
                    <div className="pt-4 border-t border-neutral-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-neutral-600">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="text-neutral-700 hover:text-primary-500 transition-colors duration-200 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="text-neutral-700 hover:text-primary-500 transition-colors duration-200 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Order History
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="text-neutral-700 hover:text-primary-500 transition-colors duration-200 py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-error-500 hover:text-error-600 transition-colors duration-200 py-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-4 pt-4 border-t border-neutral-200">
                    <Link
                      to="/login"
                      className="btn-secondary text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;