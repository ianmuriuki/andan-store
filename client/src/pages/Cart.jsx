import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Heart,
  Tag,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";

const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
    clearCart,
  } = useCart();

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 2000 ? 0 : 100;
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + deliveryFee + tax;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-main section-padding">
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="w-16 h-16 text-neutral-400" />
            </div>
            <h1 className="text-heading text-3xl font-bold text-neutral-800 mb-4">
              Your cart is empty
            </h1>
            <p className="text-neutral-600 text-xl mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/products" className="btn-primary">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Link>
            </motion.div>
          </motion.div>
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
            Shopping Cart
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-neutral-600 text-xl">
              {getCartCount()} {getCartCount() === 1 ? "item" : "items"} in your
              cart
            </p>
            <motion.button
              onClick={clearCart}
              className="text-error-500 hover:text-error-600 font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Cart
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              className="card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border border-neutral-200 rounded-card hover:shadow-card transition-shadow duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      layout
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-neutral-100 rounded-card overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-neutral-800 mb-1 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-2">
                          Category: {item.category}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-primary-500">
                            KSH {item.price}
                          </span>
                          <span className="text-sm text-neutral-500">
                            per {item.unit}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-neutral-200 rounded-button">
                          <motion.button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-neutral-50 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="px-4 py-2 font-semibold min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-[80px]">
                          <p className="text-lg font-bold text-neutral-800">
                            KSH {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-error-500 hover:text-error-600 hover:bg-error-50 rounded-button transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Continue Shopping */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Continue Shopping</span>
              </Link>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="card sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-heading text-2xl font-bold text-neutral-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-semibold text-neutral-800">
                    KSH {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span className="font-semibold text-neutral-800">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `KSH ${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Tax (16%)</span>
                  <span className="font-semibold text-neutral-800">
                    KSH {tax.toFixed(2)}
                  </span>
                </div>

                {subtotal < 2000 && (
                  <motion.div
                    className="bg-blue-50 border border-blue-200 rounded-card p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-2 text-blue-700">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Add KSH {(2000 - subtotal).toFixed(2)} more for free
                        delivery!
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-neutral-800">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary-500">
                      KSH {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/checkout" className="w-full btn-primary">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-neutral-600 text-sm">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Secure checkout with M-Pesa</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="font-semibold text-neutral-800 mb-3">
                  Have a promo code?
                </h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 input-field"
                  />
                  <motion.button
                    className="btn-secondary px-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply
                  </motion.button>
                </div>
              </div>

              {/* Wishlist */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <motion.button
                  className="w-full flex items-center justify-center space-x-2 py-3 text-neutral-600 hover:text-primary-500 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart className="w-5 h-5" />
                  <span>Save to Wishlist</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
