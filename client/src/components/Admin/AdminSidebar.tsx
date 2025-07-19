import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Settings,
  Tag,
  Truck,
  MessageSquare,
  FileText
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
      description: 'Manage Inventory'
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCart,
      description: 'Order Management'
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users,
      description: 'Customer Management'
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
      description: 'Sales & Reports'
    },
    {
      name: 'Promotions',
      path: '/admin/promotions',
      icon: Tag,
      description: 'Discounts & Offers'
    },
    {
      name: 'Delivery',
      path: '/admin/delivery',
      icon: Truck,
      description: 'Shipping Management'
    },
    {
      name: 'Reviews',
      path: '/admin/reviews',
      icon: MessageSquare,
      description: 'Customer Feedback'
    },
    {
      name: 'Reports',
      path: '/admin/reports',
      icon: FileText,
      description: 'Business Reports'
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      description: 'System Configuration'
    },
  ];

  return (
    <aside className="bg-neutral-900 text-white w-72 min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-card transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-glow'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                  {isActive && (
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Quick Stats */}
      <motion.div 
        className="mt-8 mx-4 p-4 bg-neutral-800 rounded-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-sm font-semibold mb-3 text-neutral-300">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Today's Orders</span>
            <span className="text-primary-400 font-medium">24</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Revenue</span>
            <span className="text-green-400 font-medium">KSH 12,450</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Active Users</span>
            <span className="text-blue-400 font-medium">156</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
};

export default AdminSidebar;