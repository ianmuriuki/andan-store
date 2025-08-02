import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Save, 
  Upload, 
  Mail, 
  Bell, 
  Shield, 
  Globe,
  Truck,
  CreditCard,
  Database,
  Key,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Andan Grocery',
      siteDescription: 'Fresh groceries delivered to your doorstep',
      contactEmail: 'info@andangrocery.com',
      contactPhone: '+254 700 123 456',
      address: '123 Grocery Street, Nairobi, Kenya',
      currency: 'KES',
      timezone: 'Africa/Nairobi',
      language: 'en'
    },
    delivery: {
      freeDeliveryThreshold: 2000,
      standardDeliveryFee: 100,
      expressDeliveryFee: 200,
      deliveryRadius: 25,
      estimatedDeliveryTime: '1-2 hours',
      workingHours: {
        start: '08:00',
        end: '20:00'
      }
    },
    payment: {
      mpesaEnabled: true,
      cardPaymentEnabled: false,
      cashOnDeliveryEnabled: true,
      mpesaShortcode: '174379',
      taxRate: 16
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderConfirmation: true,
      deliveryUpdates: true,
      promotionalEmails: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      ipWhitelist: []
    },
    api: {
      mpesaConsumerKey: 'your_mpesa_consumer_key',
      mpesaConsumerSecret: 'your_mpesa_consumer_secret',
      googleClientId: 'your_google_client_id',
      emailApiKey: 'your_email_api_key'
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key }
  ];

  const handleSave = (section) => {
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
  };

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <motion.div
      key="general"
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Currency
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className="input-field"
          >
            <option value="KES">Kenyan Shilling (KES)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
          className="input-field h-24 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            value={settings.general.contactPhone}
            onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Business Address
        </label>
        <textarea
          value={settings.general.address}
          onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
          className="input-field h-20 resize-none"
        />
      </div>

      <div className="flex justify-end">
        <motion.button
          onClick={() => handleSave('general')}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </motion.button>
      </div>
    </motion.div>
  );

  const renderDeliverySettings = () => (
    <motion.div
      key="delivery"
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Free Delivery Threshold (KSH)
          </label>
          <input
            type="number"
            value={settings.delivery.freeDeliveryThreshold}
            onChange={(e) => handleSettingChange('delivery', 'freeDeliveryThreshold', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Standard Delivery Fee (KSH)
          </label>
          <input
            type="number"
            value={settings.delivery.standardDeliveryFee}
            onChange={(e) => handleSettingChange('delivery', 'standardDeliveryFee', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Express Delivery Fee (KSH)
          </label>
          <input
            type="number"
            value={settings.delivery.expressDeliveryFee}
            onChange={(e) => handleSettingChange('delivery', 'expressDeliveryFee', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Delivery Radius (KM)
          </label>
          <input
            type="number"
            value={settings.delivery.deliveryRadius}
            onChange={(e) => handleSettingChange('delivery', 'deliveryRadius', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Estimated Delivery Time
          </label>
          <input
            type="text"
            value={settings.delivery.estimatedDeliveryTime}
            onChange={(e) => handleSettingChange('delivery', 'estimatedDeliveryTime', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Working Hours Start
          </label>
          <input
            type="time"
            value={settings.delivery.workingHours.start}
            onChange={(e) => handleSettingChange('delivery', 'workingHours', { ...settings.delivery.workingHours, start: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Working Hours End
          </label>
          <input
            type="time"
            value={settings.delivery.workingHours.end}
            onChange={(e) => handleSettingChange('delivery', 'workingHours', { ...settings.delivery.workingHours, end: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          onClick={() => handleSave('delivery')}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </motion.button>
      </div>
    </motion.div>
  );

  const renderPaymentSettings = () => (
    <motion.div
      key="payment"
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-800">Payment Methods</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-card">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-neutral-800">M-Pesa</h4>
                <p className="text-sm text-neutral-600">Mobile money payments</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.payment.mpesaEnabled}
                onChange={(e) => handleSettingChange('payment', 'mpesaEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-card">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-neutral-800">Card Payments</h4>
                <p className="text-sm text-neutral-600">Credit/Debit cards</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.payment.cardPaymentEnabled}
                onChange={(e) => handleSettingChange('payment', 'cardPaymentEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            M-Pesa Shortcode
          </label>
          <input
            type="text"
            value={settings.payment.mpesaShortcode}
            onChange={(e) => handleSettingChange('payment', 'mpesaShortcode', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={settings.payment.taxRate}
            onChange={(e) => handleSettingChange('payment', 'taxRate', parseFloat(e.target.value))}
            className="input-field"
            step="0.1"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          onClick={() => handleSave('payment')}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </motion.button>
      </div>
    </motion.div>
  );

  const renderApiSettings = () => (
    <motion.div
      key="api"
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-yellow-50 border border-yellow-200 rounded-card p-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800 font-medium">
            Keep your API keys secure and never share them publicly
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-neutral-700">
              M-Pesa Consumer Key
            </label>
            <motion.button
              onClick={() => setShowApiKeys(!showApiKeys)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showApiKeys ? 'Hide' : 'Show'}</span>
            </motion.button>
          </div>
          <input
            type={showApiKeys ? 'text' : 'password'}
            value={settings.api.mpesaConsumerKey}
            onChange={(e) => handleSettingChange('api', 'mpesaConsumerKey', e.target.value)}
            className="input-field font-mono"
            placeholder="Enter M-Pesa consumer key"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            M-Pesa Consumer Secret
          </label>
          <input
            type={showApiKeys ? 'text' : 'password'}
            value={settings.api.mpesaConsumerSecret}
            onChange={(e) => handleSettingChange('api', 'mpesaConsumerSecret', e.target.value)}
            className="input-field font-mono"
            placeholder="Enter M-Pesa consumer secret"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Google OAuth Client ID
          </label>
          <input
            type={showApiKeys ? 'text' : 'password'}
            value={settings.api.googleClientId}
            onChange={(e) => handleSettingChange('api', 'googleClientId', e.target.value)}
            className="input-field font-mono"
            placeholder="Enter Google OAuth client ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Email Service API Key
          </label>
          <input
            type={showApiKeys ? 'text' : 'password'}
            value={settings.api.emailApiKey}
            onChange={(e) => handleSettingChange('api', 'emailApiKey', e.target.value)}
            className="input-field font-mono"
            placeholder="Enter email service API key"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          onClick={() => handleSave('api')}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save API Keys
        </motion.button>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'delivery':
        return renderDeliverySettings();
      case 'payment':
        return renderPaymentSettings();
      case 'api':
        return renderApiSettings();
      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">Settings for {activeTab} coming soon...</p>
          </div>
        );
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
          <h1 className="text-3xl font-bold text-neutral-800">Settings</h1>
          <p className="text-neutral-600 mt-1">Configure your store settings and preferences</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-button text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                {tabs.find(t => t.id === activeTab)?.label} Settings
              </h2>
              <p className="text-neutral-600">
                Configure your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} preferences
              </p>
            </div>

            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;