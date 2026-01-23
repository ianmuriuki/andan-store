import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ShoppingCart,
  Truck,
  Shield,
  Star,
  ArrowRight,
  Leaf,
  Clock,
  Award,
  Users,
  TrendingUp,
  Heart,
  CheckCircle,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useFeaturedProducts } from "../hooks/useProducts";
import toast from "react-hot-toast";

const Home = () => {
  const {
    data: featuredProductsData,
    isLoading,
    error,
  } = useFeaturedProducts();
  const featuredProducts = featuredProductsData?.data || [];
  const { addToCart } = useCart();

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  const productsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const categoriesInView = useInView(categoriesRef, { once: true });
  const productsInView = useInView(productsRef, { once: true });

  const categories = [
    {
      name: "Fruits & Vegetables",
      value: "Fruits",
      image:
        "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=600",
      count: "100+ items",
      color: "from-green-400 to-green-600",
      description: "Fresh, organic produce",
    },
    {
      name: "Dairy & Eggs",
      value: "Dairy",
      image:
        "https://images.pexels.com/photos/5953782/pexels-photo-5953782.jpeg?auto=compress&cs=tinysrgb&w=600",
      count: "40+ items",
      color: "from-blue-400 to-blue-600",
      description: "Farm-fresh dairy products",
    },
    {
      name: "Meat & Seafood",
      value: "Meat",
      image:
        "https://images.pexels.com/photos/20187067/pexels-photo-20187067.jpeg?auto=compress&cs=tinysrgb&w=600",
      count: "30+ items",
      color: "from-red-400 to-red-600",
      description: "Premium quality meats",
    },
    {
      name: "Beverages",
      value: "Beverages",
      image:
        "https://images.pexels.com/photos/3230214/pexels-photo-3230214.jpeg?auto=compress&cs=tinysrgb&w=600",
      count: "50+ items",
      color: "from-orange-400 to-orange-600",
      description: "Refreshing drinks",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Get your groceries delivered within 1-2 hours in Nairobi and surrounding areas.",
      color: "text-primary-500",
      bgColor: "bg-primary-100",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description:
        "Fresh products sourced directly from farms and trusted suppliers with quality assurance.",
      color: "text-accent-blue",
      bgColor: "bg-blue-100",
    },
    {
      icon: Leaf,
      title: "Organic Options",
      description:
        "Wide selection of certified organic products for health-conscious customers.",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      icon: Award,
      title: "Best Prices",
      description:
        "Competitive pricing with regular discounts and special offers for members.",
      color: "text-accent-orange",
      bgColor: "bg-orange-100",
    },
  ];

  const stats = [
    { icon: Users, value: "100+", label: "Happy Customers" },
    { icon: ShoppingCart, value: "500+", label: "Orders Delivered" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: TrendingUp, value: "99%", label: "Satisfaction Rate" },
  ];

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
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section ref={heroRef} className="relative gradient-hero overflow-hidden">
        <div className="container-main section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Leaf className="w-4 h-4" />
                <span>Fresh • Organic • Local</span>
              </motion.div>

              <motion.h1
                className="text-heading text-5xl lg:text-6xl font-bold text-neutral-800 mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Fresh Groceries
                <span className="block text-gradient">Delivered Fast</span>
              </motion.h1>

              <motion.p
                className="text-body text-xl text-neutral-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Shop from the comfort of your home and get fresh, quality
                groceries delivered within hours. Pay conveniently with M-Pesa
                and enjoy our premium selection.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/products" className="btn-primary group">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Start Shopping
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/products" className="btn-secondary">
                    Browse Categories
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-8 text-sm text-neutral-600"
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span>Quick Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-primary-500" />
                  <span>Quality Guaranteed</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-300 rounded-card transform rotate-3"
                animate={{ rotate: [3, -3, 3] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.img
                src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fresh groceries"
                className="relative rounded-card shadow-card-hover w-full h-96 object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-card shadow-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">
                      4.9/5 Rating
                    </p>
                    <p className="text-sm text-neutral-600">
                      From 100+ reviews
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="container-main pb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
                    <Icon className="w-8 h-8 text-primary-500" />
                  </div>
                  <div className="text-3xl font-bold text-neutral-800 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-neutral-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="section-padding bg-neutral-50">
        <div className="container-main">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-heading text-4xl font-bold text-neutral-800 mb-4">
              Why Choose Andan?
            </h2>
            <p className="text-body text-xl text-neutral-600 max-w-2xl mx-auto">
              We're committed to providing the best grocery shopping experience
              with quality products and exceptional service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="card text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <motion.div
                    className={`w-16 h-16 ${feature.bgColor} rounded-card flex items-center justify-center mx-auto mb-6`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </motion.div>
                  <h3 className="text-heading text-xl font-semibold text-neutral-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-body text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="section-padding">
        <div className="container-main">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-heading text-4xl font-bold text-neutral-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-body text-xl text-neutral-600">
              Discover fresh products across all your favorite categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category.value}`}
                  className="group relative overflow-hidden rounded-card shadow-card hover:shadow-card-hover transition-all duration-300 block"
                >
                  <motion.div
                    className="relative h-64"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}
                    ></div>
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  </motion.div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-heading text-xl font-semibold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90 mb-1">
                      {category.description}
                    </p>
                    <p className="text-sm opacity-75">{category.count}</p>
                  </div>
                  <motion.div
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - NOW WITH REAL DATA */}
      <section ref={productsRef} className="section-padding bg-neutral-50">
        <div className="container-main">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={productsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-heading text-4xl font-bold text-neutral-800 mb-4">
                Featured Products
              </h2>
              <p className="text-body text-xl text-neutral-600">
                Hand-picked fresh products just for you
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/products"
                className="btn-secondary group hidden md:flex"
              >
                View All Products
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin">
                  <ShoppingCart className="w-12 h-12 text-primary-500" />
                </div>
                <p className="text-neutral-600 mt-4">
                  Loading featured products...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">
                Failed to load featured products
              </p>
              <Link to="/products" className="btn-primary">
                Browse All Products Instead
              </Link>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product._id}
                  className="product-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={productsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative overflow-hidden">
                    {/* Featured Badge */}
                    {product.isFeatured && (
                      <motion.div
                        className="offer-badge bg-primary-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        Featured
                      </motion.div>
                    )}

                    {/* Discount Badge */}
                    {product.discount &&
                      product.discount.value &&
                      product.discount.isActive && (
                        <motion.div
                          className="discount-badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.7 + index * 0.1,
                          }}
                        >
                          -
                          {product.discount.type === "percentage"
                            ? `${product.discount.value}%`
                            : `KSH ${product.discount.value}`}
                        </motion.div>
                      )}

                    {/* Product Image */}
                    <Link to={`/products/${product._id}`}>
                      <motion.img
                        src={product.images?.[0] || ""}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        whileHover={{ scale: 1.1 }}
                      />
                    </Link>

                    {/* Wishlist Button */}
                    <motion.button
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-4 h-4 text-neutral-600" />
                    </motion.button>
                  </div>

                  <div className="p-6">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-primary-500 font-medium bg-primary-50 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      {product.rating > 0 && (
                        <div className="rating-stars flex items-center">
                          <Star className="w-4 h-4 text-accent-yellow fill-current" />
                          <span className="text-sm text-neutral-600 ml-1">
                            {product.rating.toFixed(1)}
                          </span>
                          {product.reviewCount > 0 && (
                            <span className="text-xs text-neutral-500 ml-1">
                              ({product.reviewCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <Link to={`/products/${product._id}`}>
                      <h3 className="text-heading text-lg font-semibold text-neutral-800 mb-3 hover:text-primary-500 transition-colors duration-200 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary-500">
                          KSH {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-neutral-500 line-through">
                            KSH {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Unit */}
                    <div className="text-sm text-neutral-500 mb-4">
                      per {product.unit}
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-primary-500 text-white py-3 px-4 rounded-button hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </span>
                    </motion.button>

                    {/* Stock Warning */}
                    {product.stock > 0 && product.stock < 10 && (
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
            </div>
          ) : (
            !isLoading &&
            !error && (
              <div className="text-center py-12">
                <p className="text-neutral-600 mb-4">
                  No featured products available
                </p>
                <Link to="/products" className="btn-primary">
                  Browse All Products
                </Link>
              </div>
            )
          )}

          {/* Mobile View All Button */}
          <motion.div
            className="text-center mt-12 md:hidden"
            initial={{ opacity: 0 }}
            animate={productsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/products" className="btn-primary">
              View All Products
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
