import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const { addToCart } = useCart();

  useEffect(() => {
    // Mock product data
    const mockProduct = {
      id: id || '1',
      name: 'Fresh Organic Apples',
      price: 299,
      originalPrice: 350,
      images: [
        'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/209439/pexels-photo-209439.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Fruits',
      rating: 4.8,
      reviews: 124,
      stock: 50,
      unit: 'kg',
      badge: 'Organic',
      discount: 15,
      description: 'Fresh, crisp organic apples sourced directly from local farms.',
      longDescription: 'Our premium organic apples are carefully selected from certified organic farms in the highlands of Kenya. These apples are grown without synthetic pesticides or fertilizers, ensuring you get the purest, most nutritious fruit possible. Each apple is hand-picked at peak ripeness to guarantee maximum flavor and nutritional value.',
      nutritionalInfo: {
        calories: 52,
        protein: 0.3,
        carbs: 14,
        fat: 0.2
      },
      ingredients: ['100% Organic Apples'],
      benefits: [
        'Rich in fiber and vitamin C',
        'Supports heart health',
        'Helps with weight management',
        'Boosts immune system',
        'Promotes digestive health'
      ]
    };

    const mockReviews = [
      {
        id: '1',
        user: 'Sarah M.',
        rating: 5,
        comment: 'Absolutely fresh and delicious! The quality is outstanding and they arrived perfectly packaged.',
        date: '2024-01-10',
        verified: true
      },
      {
        id: '2',
        user: 'John D.',
        rating: 4,
        comment: 'Great apples, very crisp and sweet. Will definitely order again.',
        date: '2024-01-08',
        verified: true
      },
      {
        id: '3',
        user: 'Mary K.',
        rating: 5,
        comment: 'Best organic apples I\'ve had in Nairobi. Fast delivery too!',
        date: '2024-01-05',
        verified: false
      }
    ];

    setTimeout(() => {
      setProduct(mockProduct);
      setReviews(mockReviews);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          stock: product.stock,
          category: product.category,
          unit: product.unit
        });
      }
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const nextImage = () => {
    if (product) {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-main section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="loading-skeleton h-96 rounded-card"></div>
            <div className="space-y-4">
              <div className="loading-skeleton h-8 w-3/4 rounded"></div>
              <div className="loading-skeleton h-6 w-1/2 rounded"></div>
              <div className="loading-skeleton h-20 rounded"></div>
              <div className="loading-skeleton h-12 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Product not found</h2>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main section-padding">
        {/* Breadcrumb */}
        <motion.nav 
          className="flex items-center space-x-2 text-sm text-neutral-600 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-500 transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary-500 transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-neutral-800">{product.name}</span>
        </motion.nav>

        {/* Back Button */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link 
            to="/products" 
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </motion.div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-card overflow-hidden bg-neutral-50">
              {product.badge && (
                <motion.div 
                  className={`offer-badge ${
                    product.badge === 'Fresh' ? 'bg-green-500' :
                    product.badge === 'Organic' ? 'bg-accent-orange' :
                    product.badge === 'Premium' ? 'bg-purple-500' :
                    'bg-primary-500'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  {product.badge}
                </motion.div>
              )}
              {product.discount && (
                <motion.div 
                  className="discount-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  -{product.discount}%
                </motion.div>
              )}
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <motion.button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-5 h-5 text-neutral-700" />
                  </motion.button>
                  <motion.button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-5 h-5 text-neutral-700" />
                  </motion.button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-4">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-card overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-primary-500' : 'border-neutral-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-500 font-medium bg-primary-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2 rounded-full transition-colors ${
                    isWishlisted ? 'bg-red-100 text-red-500' : 'bg-neutral-100 text-neutral-600 hover:bg-red-100 hover:text-red-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  className="p-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-heading text-3xl font-bold text-neutral-800">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) 
                        ? 'text-accent-yellow fill-current' 
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
                <span className="text-lg font-semibold text-neutral-800 ml-2">
                  {product.rating}
                </span>
              </div>
              <span className="text-neutral-600">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-primary-500">
                KSH {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-neutral-500 line-through">
                  KSH {product.originalPrice}
                </span>
              )}
              <span className="text-neutral-600">per {product.unit}</span>
            </div>

            {/* Description */}
            <p className="text-neutral-700 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                product.stock > 10 ? 'bg-green-500' : 
                product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${
                product.stock > 10 ? 'text-green-600' : 
                product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {product.stock > 10 ? 'In Stock' : 
                 product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-neutral-700">Quantity:</span>
              <div className="flex items-center border border-neutral-200 rounded-button">
                <motion.button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="px-4 py-3 font-semibold min-w-[60px] text-center">
                  {quantity}
                </span>
                <motion.button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="p-3 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
            </motion.button>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Fast Delivery</p>
                  <p className="text-sm text-neutral-600">1-2 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Quality Guaranteed</p>
                  <p className="text-sm text-neutral-600">100% fresh</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Easy Returns</p>
                  <p className="text-sm text-neutral-600">7 days</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-neutral-200 mb-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'nutrition', label: 'Nutrition' },
              { id: 'reviews', label: `Reviews (${reviews.length})` }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id 
                    ? 'text-primary-500 border-b-2 border-primary-500' 
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4">Product Description</h3>
                  <p className="text-neutral-700 leading-relaxed mb-6">
                    {product.longDescription}
                  </p>
                </div>

                {product.benefits && (
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-800 mb-4">Health Benefits</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-neutral-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.ingredients && (
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-800 mb-4">Ingredients</h4>
                    <p className="text-neutral-700">{product.ingredients.join(', ')}</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'nutrition' && (
              <motion.div
                key="nutrition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-neutral-800 mb-6">Nutritional Information</h3>
                {product.nutritionalInfo ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-neutral-50 rounded-card">
                      <div className="text-2xl font-bold text-primary-500 mb-2">
                        {product.nutritionalInfo.calories}
                      </div>
                      <div className="text-sm text-neutral-600">Calories</div>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-card">
                      <div className="text-2xl font-bold text-primary-500 mb-2">
                        {product.nutritionalInfo.protein}g
                      </div>
                      <div className="text-sm text-neutral-600">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-card">
                      <div className="text-2xl font-bold text-primary-500 mb-2">
                        {product.nutritionalInfo.carbs}g
                      </div>
                      <div className="text-sm text-neutral-600">Carbs</div>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-card">
                      <div className="text-2xl font-bold text-primary-500 mb-2">
                        {product.nutritionalInfo.fat}g
                      </div>
                      <div className="text-sm text-neutral-600">Fat</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-600">Nutritional information not available for this product.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-neutral-800">Customer Reviews</h3>
                  <motion.button
                    className="btn-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Write Review
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      className="border-b border-neutral-200 pb-6 last:border-b-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {review.user.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-neutral-800">{review.user}</span>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating 
                                      ? 'text-accent-yellow fill-current' 
                                      : 'text-neutral-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-neutral-500">{review.date}</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;