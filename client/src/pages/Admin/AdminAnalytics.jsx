import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    revenue: { current: 0, previous: 0, growth: 0 },
    orders: { current: 0, previous: 0, growth: 0 },
    customers: { current: 0, previous: 0, growth: 0 },
    avgOrderValue: { current: 0, previous: 0, growth: 0 }
  });

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setAnalytics({
        revenue: { current: 125430, previous: 112000, growth: 12.0 },
        orders: { current: 1234, previous: 1100, growth: 12.2 },
        customers: { current: 856, previous: 745, growth: 14.9 },
        avgOrderValue: { current: 101.6, previous: 101.8, growth: -0.2 }
      });
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const topCategories = [
    { name: 'Fruits & Vegetables', revenue: 45230, percentage: 36, color: 'bg-green-500' },
    { name: 'Dairy Products', revenue: 28150, percentage: 22, color: 'bg-blue-500' },
    { name: 'Meat & Seafood', revenue: 22100, percentage: 18, color: 'bg-red-500' },
    { name: 'Beverages', revenue: 18950, percentage: 15, color: 'bg-orange-500' },
    { name: 'Bakery', revenue: 11000, percentage: 9, color: 'bg-purple-500' }
  ];

  const salesTrends = [
    { month: 'Jan', revenue: 85000, orders: 850 },
    { month: 'Feb', revenue: 92000, orders: 920 },
    { month: 'Mar', revenue: 78000, orders: 780 },
    { month: 'Apr', revenue: 105000, orders: 1050 },
    { month: 'May', revenue: 118000, orders: 1180 },
    { month: 'Jun', revenue: 125430, orders: 1234 }
  ];

  const customerMetrics = [
    { label: 'New Customers', value: 156, change: 23.5, trend: 'up' },
    { label: 'Returning Customers', value: 700, change: 8.2, trend: 'up' },
    { label: 'Customer Retention', value: '82%', change: 5.1, trend: 'up' },
    { label: 'Avg. Lifetime Value', value: 'KSH 2,450', change: -2.3, trend: 'down' }
  ];

  const getMetricCard = (title, current, previous, growth, icon, format = 'number') => {
    const Icon = icon;
    const isPositive = growth >= 0;
    
    const formatValue = (value) => {
      if (format === 'currency') return `KSH ${value.toLocaleString()}`;
      if (format === 'percentage') return `${value}%`;
      return value.toLocaleString();
    };

    return (
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-neutral-600 font-medium">{title}</p>
            <p className="text-3xl font-bold text-neutral-800 mt-1">
              {formatValue(current)}
            </p>
          </div>
          <div className={`p-3 rounded-card ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            <Icon className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
        <div className="flex items-center">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{growth.toFixed(1)}%
          </span>
          <span className="text-sm text-neutral-600 ml-2">vs previous period</span>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="loading-skeleton h-32 rounded-card"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="loading-skeleton h-80 rounded-card"></div>
          <div className="loading-skeleton h-80 rounded-card"></div>
        </div>
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
          <h1 className="text-3xl font-bold text-neutral-800">Analytics</h1>
          <p className="text-neutral-600 mt-1">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <motion.button 
            className="btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getMetricCard('Total Revenue', analytics.revenue.current, analytics.revenue.previous, analytics.revenue.growth, DollarSign, 'currency')}
        {getMetricCard('Total Orders', analytics.orders.current, analytics.orders.previous, analytics.orders.growth, ShoppingCart)}
        {getMetricCard('Total Customers', analytics.customers.current, analytics.customers.previous, analytics.customers.growth, Users)}
        {getMetricCard('Avg Order Value', analytics.avgOrderValue.current, analytics.avgOrderValue.previous, analytics.avgOrderValue.growth, Package, 'currency')}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">Revenue Trend</h2>
            <LineChart className="w-5 h-5 text-neutral-600" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 rounded-card">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <p className="text-neutral-600 font-medium">Revenue Chart</p>
              <p className="text-sm text-neutral-500">Interactive chart would be displayed here</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">+12.5%</p>
              <p className="text-sm text-neutral-600">Growth Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">KSH 4,181</p>
              <p className="text-sm text-neutral-600">Daily Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">KSH 18,200</p>
              <p className="text-sm text-neutral-600">Peak Day</p>
            </div>
          </div>
        </motion.div>

        {/* Category Performance */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">Top Categories</h2>
            <PieChart className="w-5 h-5 text-neutral-600" />
          </div>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${category.color} rounded-full`}></div>
                  <span className="font-medium text-neutral-800">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-800">KSH {category.revenue.toLocaleString()}</p>
                  <p className="text-sm text-neutral-600">{category.percentage}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Customer Metrics */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">Customer Metrics</h2>
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {customerMetrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-center p-4 bg-neutral-50 rounded-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            >
              <p className="text-2xl font-bold text-neutral-800 mb-2">{metric.value}</p>
              <p className="text-sm text-neutral-600 mb-2">{metric.label}</p>
              <div className="flex items-center justify-center">
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sales Performance Table */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">Monthly Performance</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-neutral-600" />
            <span className="text-sm text-neutral-600">2024</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Avg Order Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {salesTrends.map((trend, index) => {
                const avgOrderValue = trend.revenue / trend.orders;
                const growth = index > 0 ? ((trend.revenue - salesTrends[index - 1].revenue) / salesTrends[index - 1].revenue * 100) : 0;
                
                return (
                  <motion.tr
                    key={trend.month}
                    className="hover:bg-neutral-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {trend.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      KSH {trend.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {trend.orders.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      KSH {avgOrderValue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {index > 0 && (
                        <div className="flex items-center">
                          {growth >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span className={`font-medium ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;