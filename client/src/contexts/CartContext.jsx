import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem("andan_cart");
    if (savedCart) {                                                                                  
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Error parsing saved cart:", error);
        localStorage.removeItem("andan_cart");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("andan_cart", JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addToCart = (product) => {
    setItems((prev) => {
      // Use _id as the primary identifier (MongoDB ObjectId)
      const itemId = product._id || product.id;
      const existingItem = prev.find(
        (item) => (item._id || item.id) === itemId
      );

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return prev;
        }

        const updatedItems = prev.map((item) =>
          (item._id || item.id) === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        toast.success(`${product.name} quantity updated`, {
          icon: "🛒",
        });

        return updatedItems;
      }

      toast.success(`${product.name} added to cart`, {
        icon: "✅",
      });

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => {
      const item = prev.find((item) => (item._id || item.id) === id);
      if (item) {
        toast.success(`${item.name} removed from cart`, {
          icon: "🗑️",
        });
      }
      return prev.filter((item) => (item._id || item.id) !== id);
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if ((item._id || item.id) === id) {
          if (quantity > item.stock) {
            toast.error(`Only ${item.stock} items available in stock`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared", {
      icon: "🧹",
    });
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
