import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Camera
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const profileSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string().optional(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

const addressSchema = yup.object({
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;
type PasswordFormData = yup.InferType<typeof passwordSchema>;
type AddressFormData = yup.InferType<typeof addressSchema>;

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      street: '123 Main Street, Apt 4B',
      city: 'Nairobi',
      state: 'Nairobi County',
      zipCode: '00100',
      isDefault: true,
    },
    {
      id: '2',
      street: '456 Oak Avenue',
      city: 'Nairobi',
      state: 'Nairobi County',
      zipCode: '00200',
      isDefault: false,
    },
  ]);

  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const addressForm = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
  });

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateUser(data);
      setIsEditing(false);
    } catch (error) {
      // Error handled by context
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setShowPasswordForm(false);
      passwordForm.reset();
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const onAddressSubmit = (data: AddressFormData) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addr, ...data }
          : addr
      ));
      toast.success('Address updated successfully!');
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...data,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
      toast.success('Address added successfully!');
    }
    
    setShowAddressForm(false);
    setEditingAddress(null);
    addressForm.reset();
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    addressForm.reset(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      toast.success('Address deleted successfully!');
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
    toast.success('Default address updated!');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-main section-padding">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-heading text-4xl font-bold text-neutral-800 mb-4">
            My Profile
          </h1>
          <p className="text-neutral-600 text-xl">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card">
              {/* Profile Avatar */}
              <div className="text-center mb-6 pb-6 border-b border-neutral-200">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <motion.button
                    className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-card flex items-center justify-center border-2 border-neutral-200 hover:border-primary-500 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-4 h-4 text-neutral-600" />
                  </motion.button>
                </div>
                <h2 className="text-xl font-semibold text-neutral-800">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-neutral-600">{user?.email}</p>
              </div>

              {/* Navigation */}
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

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  className="card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-heading text-2xl font-bold text-neutral-800">
                      Profile Information
                    </h2>
                    <motion.button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`btn-${isEditing ? 'ghost' : 'secondary'}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isEditing ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </motion.button>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                          <input
                            type="text"
                            {...profileForm.register('firstName')}
                            disabled={!isEditing}
                            className={`input-field pl-10 ${!isEditing ? 'bg-neutral-50' : ''} ${
                              profileForm.formState.errors.firstName ? 'border-error-500' : ''
                            }`}
                          />
                        </div>
                        {profileForm.formState.errors.firstName && (
                          <p className="text-error-500 text-sm mt-1">
                            {profileForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                          <input
                            type="text"
                            {...profileForm.register('lastName')}
                            disabled={!isEditing}
                            className={`input-field pl-10 ${!isEditing ? 'bg-neutral-50' : ''} ${
                              profileForm.formState.errors.lastName ? 'border-error-500' : ''
                            }`}
                          />
                        </div>
                        {profileForm.formState.errors.lastName && (
                          <p className="text-error-500 text-sm mt-1">
                            {profileForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="input-field pl-10 bg-neutral-50"
                          />
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          Email cannot be changed
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                          <input
                            type="tel"
                            {...profileForm.register('phone')}
                            disabled={!isEditing}
                            className={`input-field pl-10 ${!isEditing ? 'bg-neutral-50' : ''}`}
                            placeholder="+254 700 123 456"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <motion.button
                          type="submit"
                          className="btn-primary"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </motion.button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-heading text-2xl font-bold text-neutral-800">
                        Delivery Addresses
                      </h2>
                      <motion.button
                        onClick={() => {
                          setEditingAddress(null);
                          addressForm.reset();
                          setShowAddressForm(true);
                        }}
                        className="btn-primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address, index) => (
                        <motion.div
                          key={address.id}
                          className={`border-2 rounded-card p-4 transition-colors ${
                            address.isDefault ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-5 h-5 text-neutral-600" />
                              {address.isDefault && (
                                <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <motion.button
                                onClick={() => handleEditAddress(address)}
                                className="p-1 text-neutral-600 hover:text-primary-500 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-1 text-neutral-600 hover:text-error-500 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                          
                          <div className="text-neutral-700 mb-4">
                            <p className="font-medium">{address.street}</p>
                            <p>{address.city}, {address.state}</p>
                            <p>{address.zipCode}</p>
                          </div>

                          {!address.isDefault && (
                            <motion.button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Set as Default
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Add/Edit Address Form */}
                  <AnimatePresence>
                    {showAddressForm && (
                      <motion.div
                        className="card"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold text-neutral-800">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                          </h3>
                          <motion.button
                            onClick={() => {
                              setShowAddressForm(false);
                              setEditingAddress(null);
                              addressForm.reset();
                            }}
                            className="p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </div>

                        <form onSubmit={addressForm.handleSubmit(onAddressSubmit)}>
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Street Address
                              </label>
                              <textarea
                                {...addressForm.register('street')}
                                className={`input-field h-20 resize-none ${
                                  addressForm.formState.errors.street ? 'border-error-500' : ''
                                }`}
                                placeholder="Enter your street address"
                              />
                              {addressForm.formState.errors.street && (
                                <p className="text-error-500 text-sm mt-1">
                                  {addressForm.formState.errors.street.message}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                  City
                                </label>
                                <input
                                  type="text"
                                  {...addressForm.register('city')}
                                  className={`input-field ${
                                    addressForm.formState.errors.city ? 'border-error-500' : ''
                                  }`}
                                  placeholder="City"
                                />
                                {addressForm.formState.errors.city && (
                                  <p className="text-error-500 text-sm mt-1">
                                    {addressForm.formState.errors.city.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                  State/County
                                </label>
                                <input
                                  type="text"
                                  {...addressForm.register('state')}
                                  className={`input-field ${
                                    addressForm.formState.errors.state ? 'border-error-500' : ''
                                  }`}
                                  placeholder="State/County"
                                />
                                {addressForm.formState.errors.state && (
                                  <p className="text-error-500 text-sm mt-1">
                                    {addressForm.formState.errors.state.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                  ZIP Code
                                </label>
                                <input
                                  type="text"
                                  {...addressForm.register('zipCode')}
                                  className={`input-field ${
                                    addressForm.formState.errors.zipCode ? 'border-error-500' : ''
                                  }`}
                                  placeholder="ZIP Code"
                                />
                                {addressForm.formState.errors.zipCode && (
                                  <p className="text-error-500 text-sm mt-1">
                                    {addressForm.formState.errors.zipCode.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end mt-8">
                            <motion.button
                              type="submit"
                              className="btn-primary"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {editingAddress ? 'Update Address' : 'Add Address'}
                            </motion.button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  className="card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-heading text-2xl font-bold text-neutral-800 mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Password Section */}
                    <div className="border border-neutral-200 rounded-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-800">Password</h3>
                          <p className="text-neutral-600">Change your account password</p>
                        </div>
                        <motion.button
                          onClick={() => setShowPasswordForm(!showPasswordForm)}
                          className="btn-secondary"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {showPasswordForm && (
                          <motion.form
                            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                            className="space-y-6 mt-6 pt-6 border-t border-neutral-200"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Current Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                <input
                                  type={showCurrentPassword ? 'text' : 'password'}
                                  {...passwordForm.register('currentPassword')}
                                  className={`input-field pl-10 pr-10 ${
                                    passwordForm.formState.errors.currentPassword ? 'border-error-500' : ''
                                  }`}
                                  placeholder="Enter current password"
                                />
                                <motion.button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </motion.button>
                              </div>
                              {passwordForm.formState.errors.currentPassword && (
                                <p className="text-error-500 text-sm mt-1">
                                  {passwordForm.formState.errors.currentPassword.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                New Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                <input
                                  type={showNewPassword ? 'text' : 'password'}
                                  {...passwordForm.register('newPassword')}
                                  className={`input-field pl-10 pr-10 ${
                                    passwordForm.formState.errors.newPassword ? 'border-error-500' : ''
                                  }`}
                                  placeholder="Enter new password"
                                />
                                <motion.button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </motion.button>
                              </div>
                              {passwordForm.formState.errors.newPassword && (
                                <p className="text-error-500 text-sm mt-1">
                                  {passwordForm.formState.errors.newPassword.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Confirm New Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                <input
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  {...passwordForm.register('confirmPassword')}
                                  className={`input-field pl-10 pr-10 ${
                                    passwordForm.formState.errors.confirmPassword ? 'border-error-500' : ''
                                  }`}
                                  placeholder="Confirm new password"
                                />
                                <motion.button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </motion.button>
                              </div>
                              {passwordForm.formState.errors.confirmPassword && (
                                <p className="text-error-500 text-sm mt-1">
                                  {passwordForm.formState.errors.confirmPassword.message}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-end space-x-4">
                              <motion.button
                                type="button"
                                onClick={() => {
                                  setShowPasswordForm(false);
                                  passwordForm.reset();
                                }}
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
                                <Save className="w-4 h-4 mr-2" />
                                Update Password
                              </motion.button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Account Information */}
                    <div className="border border-neutral-200 rounded-card p-6">
                      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Account Information</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Account Created:</span>
                          <span className="text-neutral-800">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Last Login:</span>
                          <span className="text-neutral-800">{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Account Status:</span>
                          <span className="text-green-600 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;