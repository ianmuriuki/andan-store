import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Heart,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    minPrice: 0,
    maxPrice: 5000,
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: productsData, isLoading, error } = useProducts(filters);
  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {};
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [selectedCategory, setSelectedCategory] = useState(filters.category);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();

  const categories = [
    "All Categories",
    "Fruits",
    "Vegetables",
    "Dairy",
    "Meat",
    "Seafood",
    "Beverages",
    "Bakery",
    "Snacks",
    "Frozen",
    "Pantry",
  ];

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
  ];

  // Update filters and refetch products when search/category/price/sort changes
  useEffect(() => {
    let sortByValue = "name";
    let sortOrderValue = "asc";
    if (sortBy === "price-low") {
      sortByValue = "price";
      sortOrderValue = "asc";
    } else if (sortBy === "price-high") {
      sortByValue = "price";
      sortOrderValue = "desc";
    } else if (sortBy === "rating") {
      sortByValue = "rating";
      sortOrderValue = "desc";
    } else if (sortBy === "newest") {
      sortByValue = "createdAt";
      sortOrderValue = "desc";
    }
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      category: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: sortByValue,
      sortOrder: sortOrderValue,
      page: 1, // reset to first page on filter change
    }));
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      stock: product.stock,
      category: product.category,
      unit: product.unit,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange([0, 5000]);
    setSortBy("name");
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-main section-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="loading-skeleton h-80 rounded-card"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main section-padding">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-heading text-4xl font-bold text-neutral-800 mb-4">
            Fresh Groceries
          </h1>
          <p className="text-body text-xl text-neutral-600">
            Discover our wide selection of fresh, quality products
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-search"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field lg:w-48"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category === "All Categories" ? "" : category}
                >
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field lg:w-48"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-neutral-100 rounded-button p-1">
              <motion.button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-button transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm"
                    : "text-neutral-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-button transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "text-neutral-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Advanced Filters Toggle */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </motion.button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="mt-6 pt-6 border-t border-neutral-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Price Range (KSH)
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            parseInt(e.target.value) || 0,
                            priceRange[1],
                          ])
                        }
                        className="input-field flex-1"
                      />
                      <span className="text-neutral-500">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value) || 5000,
                          ])
                        }
                        className="input-field flex-1"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <motion.button
                      onClick={clearFilters}
                      className="btn-ghost w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear All Filters
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-neutral-600">
            Showing {products.length} of {pagination.total || products.length}{" "}
            products
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </motion.div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          {products.length > 0 ? (
            <motion.div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "space-y-6"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  className={
                    viewMode === "grid"
                      ? "product-card"
                      : "card flex flex-col md:flex-row"
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div
                    className={`relative ${
                      viewMode === "list" ? "md:w-48 md:flex-shrink-0" : ""
                    }`}
                  >
                    {/* Badges and discounts can be added here if available from backend */}
                    <Link to={`/products/${product._id}`}>
                      <motion.img
                        src={product.images?.[0] || ""}
                        alt={product.name}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === "grid" ? "h-48" : "h-32 md:h-full"
                        }`}
                        whileHover={{ scale: 1.05 }}
                      />
                    </Link>
                    <motion.button
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-4 h-4 text-neutral-600" />
                    </motion.button>
                  </div>

                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-primary-500 font-medium bg-primary-50 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <div className="rating-stars">
                        <Star className="w-4 h-4 text-accent-yellow fill-current" />
                        <span className="text-sm text-neutral-600 ml-1">
                          {product.rating}
                        </span>
                        <span className="text-xs text-neutral-500 ml-1">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                    </div>

                    <Link to={`/products/${product._id}`}>
                      <h3 className="text-heading text-lg font-semibold text-neutral-800 mb-2 hover:text-primary-500 transition-colors duration-200">
                        {product.name}
                      </h3>
                    </Link>

                    {viewMode === "list" && (
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary-500">
                          KSH {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-neutral-500 line-through">
                            KSH {product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-neutral-500">
                        per {product.unit}
                      </span>
                    </div>

                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-primary-500 text-white py-3 px-4 rounded-button hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </motion.button>

                    {product.stock < 10 && (
                      <motion.p
                        className="text-accent-orange text-sm mt-2 font-medium text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        Only {product.stock} left in stock!
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-heading text-2xl font-semibold text-neutral-800 mb-4">
                No products found
              </h3>
              <p className="text-neutral-600 mb-8">
                Try adjusting your search or filter criteria
              </p>
              <motion.button
                onClick={clearFilters}
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Products;
