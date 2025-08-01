import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Edit,
  Trash2,
  UserPlus,
  MoreVertical,
  Shield,
  User,
} from "lucide-react";
import { userService } from "../../services/userService";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "user",
    status: "active",
    password: "",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError("Failed to fetch users");
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      status: user.status || "active",
      password: "",
      avatar: user.avatar || "",
    });
    setAvatarUrl(user.avatar || "");
    setAvatarFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(id);
        toast.success("User deleted");
        fetchUsers();
      } catch (err) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "user",
      status: "active",
      password: "",
      avatar: "",
    });
    setAvatarUrl("");
    setAvatarFile(null);
    setShowModal(true);
  };

  const handleStatusToggle = async (id) => {
    const user = users.find((u) => u._id === id);
    if (!user) return;
    try {
      await userService.updateUser(id, {
        status: user.status === "active" ? "inactive" : "active",
      });
      toast.success("User status updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const roleOptions = ['admin', 'editor', 'viewer'];
  const statusOptions = ['All', 'active', 'inactive'];


  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await userService.uploadAvatar(file);
      if (res.success) {
        setAvatarUrl(res.filePath);
        setForm((prev) => ({ ...prev, avatar: res.filePath }));
        toast.success("Avatar uploaded!");
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (avatarUrl) payload.avatar = avatarUrl;
      if (editingUser) {
        await userService.updateUser(editingUser._id, payload);
        toast.success("User updated");
      } else {
        await userService.createUser(payload);
        toast.success("User created");
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to save user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "" ||
      roleFilter === "All" ||
      user.role === roleFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "" ||
      statusFilter === "All" ||
      user.status === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = [
    {
      label: "Total Users",
      value: users.length,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.status === "active").length,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Admin Users",
      value: users.filter((u) => u.role === "admin").length,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "New This Month",
      value: 12,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
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
          <p className="text-neutral-600 mt-1">
            Manage customer accounts and administrators
          </p>
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
                <p className="text-sm text-neutral-600 font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-neutral-800 mt-1">
                  {stat.value}
                </p>
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
            {Array.isArray(roleOptions) &&
              roleOptions.map((role) => (
                <option key={role} value={role === "All" ? "" : role}>
                  {role}
                </option>
              ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field md:w-48"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status === "All" ? "" : status}>
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
                    key={user._id}
                    className="hover:bg-neutral-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt="avatar"
                            className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary-100"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-semibold text-sm">
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-neutral-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-neutral-500">
                            Joined{" "}
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {user.email}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role === "admin" ? (
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
                        onClick={() => handleStatusToggle(user._id)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
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
                      KSH {(user.totalSpent ?? 0).toFixed(2)}
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
                          onClick={() => handleDelete(user._id)}
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
                    {editingUser ? "Edit User" : "Add New User"}
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

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="flex flex-col items-center mb-4">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary-100 mb-2"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-2">
                        <span className="text-white font-bold text-xl">
                          {form.firstName.charAt(0)}
                          {form.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                      }
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Change Avatar"}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                      disabled={uploading}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      className="input-field"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Role
                      </label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleFormChange}
                        className="input-field"
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
                        name="status"
                        value={form.status}
                        onChange={handleFormChange}
                        className="input-field"
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
                        name="password"
                        value={form.password}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  )}
                  <button type="submit" className="btn-primary w-full">
                    {editingUser ? "Update User" : "Add User"}
                  </button>
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
