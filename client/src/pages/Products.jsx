import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts, useSearchProducts } from "../hooks/useProducts";
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
  });
  const { data: productsData, isLoading, error } = useProducts(filters);
  const product = productsData?.data || [];
  const pagination = productsData?.pagination || {};
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [setIsLoading] = useState(true);

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

  // Mock products data
  useEffect(() => {
    const mockProducts = [
      {
        id: "1",
        name: "Fresh Organic Apples",
        price: 299,
        originalPrice: 350,
        image:
          "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Fruits",
        rating: 4.8,
        reviews: 124,
        stock: 50,
        unit: "kg",
        badge: "Organic",
        discount: 15,
        description:
          "Fresh, crisp organic apples sourced directly from local farms.",
      },
      {
        id: "2",
        name: "Farm Fresh Milk",
        price: 120,
        image:
          "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Dairy",
        rating: 4.9,
        reviews: 89,
        stock: 30,
        unit: "liter",
        badge: "Fresh",
        description: "Pure, fresh milk from grass-fed cows, rich in nutrients.",
      },
      {
        id: "3",
        name: "Artisan Whole Grain Bread",
        price: 180,
        image:
          "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Bakery",
        rating: 4.7,
        reviews: 67,
        stock: 25,
        unit: "loaf",
        badge: "Artisan",
        description: "Handcrafted whole grain bread baked fresh daily.",
      },
      {
        id: "4",
        name: "Fresh Baby Spinach",
        price: 89,
        image:
          "https://images.pexels.com/photos/2068303/pexels-photo-2068303.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Vegetables",
        rating: 4.6,
        reviews: 45,
        stock: 40,
        unit: "bunch",
        badge: "Fresh",
        description:
          "Tender baby spinach leaves, perfect for salads and cooking.",
      },
      {
        id: "5",
        name: "Premium Beef Steak",
        price: 1200,
        originalPrice: 1400,
        image:
          "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Meat",
        rating: 4.9,
        reviews: 156,
        stock: 15,
        unit: "kg",
        badge: "Premium",
        discount: 14,
        description: "Premium quality beef steak, tender and flavorful.",
      },
      {
        id: "6",
        name: "Fresh Orange Juice",
        price: 250,
        image:
          "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Beverages",
        rating: 4.5,
        reviews: 78,
        stock: 35,
        unit: "liter",
        badge: "Fresh",
        description: "Freshly squeezed orange juice, no preservatives added.",
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
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
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </motion.div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
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
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
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
                    {product.badge && (
                      <motion.div
                        className={`offer-badge ${
                          product.badge === "Fresh"
                            ? "bg-green-500"
                            : product.badge === "Organic"
                            ? "bg-accent-orange"
                            : product.badge === "Premium"
                            ? "bg-purple-500"
                            : "bg-primary-500"
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        {product.badge}
                      </motion.div>
                    )}
                    {product.discount && (
                      <motion.div
                        className="discount-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      >
                        -{product.discount}%
                      </motion.div>
                    )}
                    <Link to={`/products/${product.id}`}>
                      <motion.img
                        src={product.image}
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
                          ({product.reviews})
                        </span>
                      </div>
                    </div>

                    <Link to={`/products/${product.id}`}>
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
