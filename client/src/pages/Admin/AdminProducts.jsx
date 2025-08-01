import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  MoreVertical,
} from "lucide-react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../hooks/useProducts";

const initialForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  unit: "",
  description: "",
  images: [""], // For now, single image URL
};

const AdminProducts = () => {
  // Fetch products from backend
  const { data, isLoading, error } = useProducts();
  const products = data?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialForm);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || "",
        category: editingProduct.category || "",
        price: editingProduct.price || "",
        stock: editingProduct.stock || "",
        unit: editingProduct.unit || "",
        description: editingProduct.description || "",
        images: editingProduct.images?.length ? editingProduct.images : [""],
      });
    } else {
      setForm(initialForm);
    }
  }, [editingProduct, showModal]);

  const categories = [
    "All",
    "Fruits",
    "Vegetables",
    "Dairy",
    "Meat",
    "Beverages",
    "Bakery",
  ];
  const units = ["kg", "g", "liter", "ml", "piece", "pack", "dozen", "bunch"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      selectedCategory === "All" ||
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, images: [e.target.value] }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setForm((prev) => ({ ...prev, images: [data.url] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.filter(Boolean), // ensure no empty strings
    };
    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct._id, productData: payload },
        {
          onSuccess: () => setShowModal(false),
        }
      );
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => setShowModal(false),
      });
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { color: "text-red-600", bg: "bg-red-100", label: "Out of Stock" };
    if (stock < 10)
      return {
        color: "text-orange-600",
        bg: "bg-orange-100",
        label: "Low Stock",
      };
    return { color: "text-green-600", bg: "bg-green-100", label: "In Stock" };
  };

  if (isLoading) {
    return <div className="p-8">Loading products...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-600">Error loading products.</div>;
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
          <h1 className="text-3xl font-bold text-neutral-800">Products</h1>
          <p className="text-neutral-600 mt-1">
            Manage your product inventory and catalog
          </p>
        </div>
        <motion.button
          onClick={handleAddNew}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Products",
            value: products.length,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "Active Products",
            value: products.filter((p) => p.isActive).length,
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            label: "Low Stock",
            value: products.filter((p) => p.stock < 10 && p.stock > 0).length,
            color: "text-orange-600",
            bg: "bg-orange-100",
          },
          {
            label: "Out of Stock",
            value: products.filter((p) => p.stock === 0).length,
            color: "text-red-600",
            bg: "bg-red-100",
          },
        ].map((stat, index) => (
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
              placeholder="Search products by name, category, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-search"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field md:w-48"
          >
            {categories.map((category) => (
              <option key={category} value={category === "All" ? "" : category}>
                {category}
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

      {/* Products Table */}
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
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              <AnimatePresence>
                {filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <motion.tr
                      key={product._id}
                      className="hover:bg-neutral-50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <motion.img
                            src={product.images?.[0] || ""}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-card mr-4"
                            whileHover={{ scale: 1.1 }}
                          />
                          <div>
                            <div className="text-sm font-medium text-neutral-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-neutral-500">
                              ID: {product._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                        KSH {product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${stockStatus.bg} ${stockStatus.color}`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {product.salesCount || 0} sold
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isActive ? "active" : "inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() =>
                              console.log("View product", product._id)
                            }
                            className="text-neutral-600 hover:text-primary-600 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(product._id)}
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
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal for Add/Edit Product */}
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
                    {editingProduct ? "Edit Product" : "Add New Product"}
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

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Enter product name"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        required
                        minLength={2}
                        maxLength={200}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Category
                      </label>
                      <select
                        className="input-field"
                        name="category"
                        value={form.category}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Meat">Meat</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Bakery">Bakery</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Price (KSH)
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="Enter price"
                        name="price"
                        value={form.price}
                        onChange={handleFormChange}
                        required
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="Enter stock quantity"
                        name="stock"
                        value={form.stock}
                        onChange={handleFormChange}
                        required
                        min={0}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Unit
                      </label>
                      <select
                        className="input-field"
                        name="unit"
                        value={form.unit}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Select unit</option>
                        {units.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="input-field h-24 resize-none"
                      placeholder="Enter product description"
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      required
                      minLength={10}
                      maxLength={2000}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Product Image URL
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="input-field"
                      onChange={handleImageUpload}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-neutral-200">
                    <motion.button
                      type="button"
                      onClick={() => setShowModal(false)}
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
                      disabled={
                        createProduct.isLoading || updateProduct.isLoading
                      }
                    >
                      {editingProduct
                        ? updateProduct.isLoading
                          ? "Updating..."
                          : "Update Product"
                        : createProduct.isLoading
                        ? "Adding..."
                        : "Add Product"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
