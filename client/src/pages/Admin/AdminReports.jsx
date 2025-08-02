import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Calendar, 
  FileText, 
  BarChart3, 
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Filter,
  Eye,
  Printer
} from 'lucide-react';

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: DollarSign, description: 'Revenue and sales analytics' },
    { id: 'orders', name: 'Orders Report', icon: ShoppingCart, description: 'Order statistics and trends' },
    { id: 'customers', name: 'Customer Report', icon: Users, description: 'Customer behavior and demographics' },
    { id: 'products', name: 'Product Report', icon: Package, description: 'Product performance and inventory' },
    { id: 'delivery', name: 'Delivery Report', icon: BarChart3, description: 'Delivery performance metrics' },
    { id: 'financial', name: 'Financial Report', icon: TrendingUp, description: 'Comprehensive financial overview' }
  ];

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  useEffect(() => {
    // Mock report data generation
    const generateReportData = () => {
      switch (selectedReport) {
        case 'sales':
          return {
            summary: {
              totalRevenue: 125430,
              totalOrders: 1234,
              avgOrderValue: 101.6,
              growth: 12.5
            },
            details: [
              { period: 'Week 1', revenue: 28500, orders: 285, avgValue: 100 },
              { period: 'Week 2', revenue: 32100, orders: 321, avgValue: 100 },
              { period: 'Week 3', revenue: 29800, orders: 298, avgValue: 100 },
              { period: 'Week 4', revenue: 35030, orders: 330, avgValue: 106.2 }
            ]
          };
        case 'orders':
          return {
            summary: {
              totalOrders: 1234,
              completedOrders: 1156,
              cancelledOrders: 78,
              completionRate: 93.7
            },
            details: [
              { status: 'Completed', count: 1156, percentage: 93.7 },
              { status: 'Cancelled', count: 78, percentage: 6.3 },
              { status: 'Pending', count: 45, percentage: 3.6 },
              { status: 'Processing', count: 23, percentage: 1.9 }
            ]
          };
        case 'customers':
          return {
            summary: {
              totalCustomers: 856,
              newCustomers: 156,
              returningCustomers: 700,
              retentionRate: 81.8
            },
            details: [
              { segment: 'New Customers', count: 156, percentage: 18.2 },
              { segment: 'Returning Customers', count: 700, percentage: 81.8 },
              { segment: 'VIP Customers', count: 89, percentage: 10.4 },
              { segment: 'Inactive Customers', count: 234, percentage: 27.3 }
            ]
          };
        default:
          return null;
      }
    };

    setReportData(generateReportData());
  }, [selectedReport, dateRange]);

  const handleGenerateReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Report generated successfully');
    }, 2000);
  };

  const handleExportReport = (format) => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
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
          <h1 className="text-3xl font-bold text-neutral-800">Reports</h1>
          <p className="text-neutral-600 mt-1">Generate comprehensive business reports and analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => handleExportReport('pdf')}
            className="btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </motion.button>
          <motion.button 
            onClick={() => handleExportReport('excel')}
            className="btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Report Configuration */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Report Type
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="input-field"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <motion.button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? 'Generating...' : 'Generate Report'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((type, index) => {
          const Icon = type.icon;
          const isSelected = selectedReport === type.id;
          
          return (
            <motion.div
              key={type.id}
              className={`card cursor-pointer transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:shadow-card-hover'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              onClick={() => setSelectedReport(type.id)}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-card ${isSelected ? 'bg-primary-500' : 'bg-neutral-100'}`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-neutral-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800">{type.name}</h3>
                  <p className="text-sm text-neutral-600">{type.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Report Preview */}
      {reportData && (
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">
              {reportTypes.find(t => t.id === selectedReport)?.name} Preview
            </h2>
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <Calendar className="w-4 h-4" />
              <span>{dateRanges.find(r => r.value === dateRange)?.label}</span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Object.entries(reportData.summary).map(([key, value], index) => (
              <motion.div
                key={key}
                className="bg-neutral-50 rounded-card p-4 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
              >
                <p className="text-2xl font-bold text-neutral-800 mb-2">
                  {typeof value === 'number' && key.includes('revenue') ? `KSH ${value.toLocaleString()}` :
                   typeof value === 'number' && key.includes('Rate') ? `${value}%` :
                   typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                <p className="text-sm text-neutral-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  {Object.keys(reportData.details[0] || {}).map(key => (
                    <th key={key} className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {reportData.details.map((row, index) => (
                  <motion.tr
                    key={index}
                    className="hover:bg-neutral-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.0 + index * 0.05 }}
                  >
                    {Object.entries(row).map(([key, value]) => (
                      <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {typeof value === 'number' && key.includes('revenue') ? `KSH ${value.toLocaleString()}` :
                         typeof value === 'number' && key.includes('percentage') ? `${value}%` :
                         typeof value === 'number' && key.includes('Value') ? `KSH ${value}` :
                         typeof value === 'number' ? value.toLocaleString() : value}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export Options */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
            <div className="text-sm text-neutral-600">
              Report generated on {new Date().toLocaleDateString()}
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => handleExportReport('pdf')}
                className="btn-ghost text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </motion.button>
              <motion.button
                onClick={() => handleExportReport('excel')}
                className="btn-ghost text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </motion.button>
              <motion.button
                onClick={() => handleExportReport('csv')}
                className="btn-secondary text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Export CSV
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Reports */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">Quick Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Daily Sales', description: 'Today\'s sales summary', action: 'Generate' },
            { name: 'Weekly Summary', description: 'This week\'s performance', action: 'Generate' },
            { name: 'Top Products', description: 'Best selling products', action: 'Generate' },
            { name: 'Customer Activity', description: 'Recent customer activity', action: 'Generate' }
          ].map((report, index) => (
            <motion.div
              key={index}
              className="border border-neutral-200 rounded-card p-4 hover:shadow-card transition-shadow cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-medium text-neutral-800 mb-2">{report.name}</h3>
              <p className="text-sm text-neutral-600 mb-4">{report.description}</p>
              <motion.button
                onClick={() => toast.success(`${report.name} generated`)}
                className="w-full btn-ghost text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-4 h-4 mr-2" />
                {report.action}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scheduled Reports */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">Scheduled Reports</h2>
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Report
          </motion.button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Weekly Sales Report', frequency: 'Every Monday', nextRun: '2024-01-22', status: 'active' },
            { name: 'Monthly Financial Report', frequency: 'First of month', nextRun: '2024-02-01', status: 'active' },
            { name: 'Customer Analytics', frequency: 'Every Friday', nextRun: '2024-01-26', status: 'paused' }
          ].map((schedule, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-4 border border-neutral-200 rounded-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
            >
              <div>
                <h3 className="font-medium text-neutral-800">{schedule.name}</h3>
                <p className="text-sm text-neutral-600">{schedule.frequency} • Next: {schedule.nextRun}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  schedule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {schedule.status}
                </span>
                <motion.button
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminReports;