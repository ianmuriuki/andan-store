import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Calendar,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  MoreVertical
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: 'KSH 125,430',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Customers',
      value: '856',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Products',
      value: '142',
      change: '-2.4%',
      trend: 'down',
      icon: Package,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
  ];

  const recentOrders = [
    { 
      id: 'ORD001', 
      customer: 'John Doe', 
      amount: 'KSH 1,250', 
      status: 'delivered', 
      date: '2024-01-15',
      items: 3
    },
    { 
      id: 'ORD002', 
      customer: 'Jane Smith', 
      amount: 'KSH 850', 
      status: 'processing', 
      date: '2024-01-14',
      items: 2
    },
    { 
      id: 'ORD003', 
      customer: 'Mike Johnson', 
      amount: 'KSH 2,100', 
      status: 'shipped', 
      date: '2024-01-14',
      items: 5
    },
    { 
      id: 'ORD004', 
      customer: 'Sarah Wilson', 
      amount: 'KSH 750', 
      status: 'pending', 
      date: '2024-01-13',
      items: 1
    },
  ];

  const topProducts = [
    { 
      name: 'Fresh Organic Apples', 
      sales: 145, 
      revenue: 'KSH 43,355',
      image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=100',
      trend: 'up'
    },
    { 
      name: 'Farm Fresh Milk', 
      sales: 89, 
      revenue: 'KSH 10,680',
      image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=100',
      trend: 'up'
    },
    { 
      name: 'Whole Grain Bread', 
      sales: 67, 
      revenue: 'KSH 12,060',
      image: 'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=100',
      trend: 'down'
    },
    { 
      name: 'Fresh Spinach', 
      sales: 56, 
      revenue: 'KSH 4,984',
      image: 'https://images.pexels.com/photos/2068303/pexels-photo-2068303.jpeg?auto=compress&cs=tinysrgb&w=100',
      trend: 'up'
    },
  ];

  const getStatusColor = (status) => {
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
          <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>
          <p className="text-neutral-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-neutral-600 bg-white px-4 py-2 rounded-card shadow-card">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="card hover:shadow-card-hover cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-neutral-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-neutral-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-card`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div className="flex items-center">
                {stat.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-neutral-600 ml-2">vs last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">Revenue Overview</h2>
            <button className="p-2 hover:bg-neutral-100 rounded-button transition-colors">
              <MoreVertical className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 rounded-card">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <p className="text-neutral-600 font-medium">Revenue Chart</p>
              <p className="text-sm text-neutral-500">Chart visualization would go here</p>
            </div>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">Top Products</h2>
            <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between py-3 hover:bg-neutral-50 rounded-button px-3 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-card"
                  />
                  <div>
                    <p className="font-medium text-neutral-800">{product.name}</p>
                    <p className="text-sm text-neutral-600">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">{product.revenue}</p>
                  <div className="flex items-center">
                    {product.trend === 'up' ? (
                      <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${product.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {product.trend === 'up' ? '+' : '-'}12%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">Recent Orders</h2>
          <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
            View All Orders
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 rounded-card">
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
                  Amount
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
              {recentOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  className="hover:bg-neutral-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {order.items} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <motion.button
                      className="text-primary-600 hover:text-primary-900 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;