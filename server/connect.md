# Database Connection & Frontend Integration Guide

## Overview
This guide explains how to connect the backend to MongoDB database and integrate the frontend with real API data, removing all mock data.

## Database Setup

### 1. MongoDB Installation

#### Option A: Local MongoDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y mongodb

# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
```

#### Option B: MongoDB Atlas (Cloud)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string

### 2. Database Configuration

Update `server/.env`:
```bash
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/andan_grocery

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/andan_grocery?retryWrites=true&w=majority
```

### 3. Database Seeding

Create `server/src/seeders/productSeeder.js`:

```javascript
import { Product } from '../models/Product.js';

const sampleProducts = [
  {
    name: 'Fresh Organic Apples',
    description: 'Crisp, sweet organic apples sourced directly from local farms.',
    shortDescription: 'Fresh, crisp organic apples',
    price: 299,
    originalPrice: 350,
    category: 'Fruits',
    images: [
      'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 50,
    unit: 'kg',
    isActive: true,
    isFeatured: true,
    isOrganic: true,
    tags: ['fresh', 'organic', 'local'],
    nutritionalInfo: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4,
      sugar: 10.4
    },
    storage: 'Refrigerated',
    shelfLife: 14
  },
  {
    name: 'Farm Fresh Milk',
    description: 'Pure, fresh milk from grass-fed cows, rich in nutrients.',
    shortDescription: 'Pure, fresh milk from grass-fed cows',
    price: 120,
    category: 'Dairy',
    images: [
      'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 30,
    unit: 'liter',
    isActive: true,
    isFeatured: true,
    tags: ['fresh', 'dairy', 'calcium'],
    nutritionalInfo: {
      calories: 42,
      protein: 3.4,
      carbs: 5,
      fat: 1,
      fiber: 0,
      sugar: 5
    },
    storage: 'Refrigerated',
    shelfLife: 7
  },
  {
    name: 'Artisan Whole Grain Bread',
    description: 'Handcrafted whole grain bread baked fresh daily with organic ingredients.',
    shortDescription: 'Handcrafted whole grain bread',
    price: 180,
    category: 'Bakery',
    images: [
      'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 25,
    unit: 'loaf',
    isActive: true,
    isFeatured: true,
    tags: ['artisan', 'whole-grain', 'fresh-baked'],
    nutritionalInfo: {
      calories: 247,
      protein: 13,
      carbs: 41,
      fat: 4,
      fiber: 6,
      sugar: 4
    },
    storage: 'Room Temperature',
    shelfLife: 5
  },
  {
    name: 'Fresh Baby Spinach',
    description: 'Tender baby spinach leaves, perfect for salads and cooking.',
    shortDescription: 'Tender baby spinach leaves',
    price: 89,
    category: 'Vegetables',
    images: [
      'https://images.pexels.com/photos/2068303/pexels-photo-2068303.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 40,
    unit: 'bunch',
    isActive: true,
    isFeatured: true,
    isOrganic: true,
    tags: ['fresh', 'organic', 'leafy-greens'],
    nutritionalInfo: {
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      fiber: 2.2,
      sugar: 0.4
    },
    storage: 'Refrigerated',
    shelfLife: 7
  },
  {
    name: 'Premium Beef Steak',
    description: 'Premium quality beef steak, tender and flavorful.',
    shortDescription: 'Premium quality beef steak',
    price: 1200,
    originalPrice: 1400,
    category: 'Meat',
    images: [
      'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 15,
    unit: 'kg',
    isActive: true,
    isFeatured: true,
    tags: ['premium', 'protein', 'beef'],
    nutritionalInfo: {
      calories: 250,
      protein: 26,
      carbs: 0,
      fat: 15,
      fiber: 0,
      sugar: 0
    },
    storage: 'Refrigerated',
    shelfLife: 3
  },
  {
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice, no preservatives added.',
    shortDescription: 'Freshly squeezed orange juice',
    price: 250,
    category: 'Beverages',
    images: [
      'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 35,
    unit: 'liter',
    isActive: true,
    isFeatured: true,
    tags: ['fresh', 'vitamin-c', 'natural'],
    nutritionalInfo: {
      calories: 45,
      protein: 0.7,
      carbs: 10.4,
      fat: 0.2,
      fiber: 0.2,
      sugar: 8.1
    },
    storage: 'Refrigerated',
    shelfLife: 5
  }
];

export const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    
    console.log('✅ Products seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};
```

Create `server/src/seeders/index.js`:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedProducts } from './productSeeder.js';

dotenv.config();

const runSeeders = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Run seeders
    await seedProducts();

    console.log('✅ All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
};

runSeeders();
```

Add to `server/package.json`:
```json
{
  "scripts": {
    "seed": "node src/seeders/index.js"
  }
}
```

## Frontend API Integration

### 1. API Service Layer

Create `client/src/services/api.js`:

```javascript
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Product Service

Create `client/src/services/productService.js`:

```javascript
import api from './api';

export const productService = {
  // Get all products with filters
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get featured products
  async getFeaturedProducts() {
    const response = await api.get('/products/featured');
    return response.data;
  },

  // Search products
  async searchProducts(query, params = {}) {
    const response = await api.get('/products/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  // Get products by category
  async getProductsByCategory(category, params = {}) {
    const response = await api.get(`/products/category/${category}`, { params });
    return response.data;
  },

  // Add product review
  async addReview(productId, reviewData) {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  }
};
```

### 3. Order Service

Create `client/src/services/orderService.js`:

```javascript
import api from './api';

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  async getUserOrders(params = {}) {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  async getOrder(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status
  async updateOrderStatus(id, status) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancel order
  async cancelOrder(id, reason) {
    const response = await api.patch(`/orders/${id}/cancel`, { reason });
    return response.data;
  }
};
```

### 4. React Query Integration

Update `client/src/hooks/useProducts.js`:

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

// Get products with filters
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};

// Get featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productService.getFeaturedProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search products
export const useSearchProducts = (query, filters = {}) => {
  return useQuery({
    queryKey: ['products', 'search', query, filters],
    queryFn: () => productService.searchProducts(query, filters),
    enabled: !!query,
  });
};

// Add product review
export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, reviewData }) => 
      productService.addReview(productId, reviewData),
    onSuccess: (data, variables) => {
      toast.success('Review added successfully!');
      queryClient.invalidateQueries(['product', variables.productId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add review');
    },
  });
};
```

### 5. Update Frontend Components

Update `client/src/pages/Home.jsx`:

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeaturedProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
// ... other imports

const Home = () => {
  const { data: featuredProductsData, isLoading, error } = useFeaturedProducts();
  const { addToCart } = useCart();

  const featuredProducts = featuredProductsData?.data || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      stock: product.stock,
      category: product.category,
      unit: product.unit
    });
  };

  // Rest of component...
};
```

Update `client/src/pages/Products.jsx`:

```javascript
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useSearchProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
// ... other imports

const Products = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: 0,
    maxPrice: 5000,
    page: 1,
    limit: 12
  });

  const { data: productsData, isLoading, error } = useProducts(filters);
  const { addToCart } = useCart();

  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {};

  // Rest of component logic...
};
```

## Environment Setup

### 1. Client Environment
Create `client/.env`:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Andan Grocery
```

### 2. Server Environment
Create `server/.env`:
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/andan_grocery
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
BCRYPT_SALT_ROUNDS=12
```

## Running the Application

### 1. Start MongoDB
```bash
# Local MongoDB
sudo systemctl start mongod

# Or if using MongoDB Atlas, ensure your connection string is correct
```

### 2. Seed Database
```bash
cd server
npm run seed
```

### 3. Start Backend
```bash
cd server
npm run dev
```

### 4. Start Frontend
```bash
cd client
npm run dev
```

## API Endpoints

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get single product
- `POST /api/products/:id/reviews` - Add product review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

## Error Handling

### Frontend Error Boundary
```javascript
// client/src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```
V
## Testing the Integration

### 1. Test Database Connection
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ismaster')"

# Test API endpoint
curl http://localhost:5000/api/products
```

### 2. Test Frontend Integration
1. Open browser to `http://localhost:5173`
2. Check if products load from database
3. Test user registration and login
4. Test adding products to cart
5. Test order creation

### 3. Monitor Logs
- Backend logs: Check server console for API requests
- Frontend logs: Check browser console for errors
- Database logs: Monitor MongoDB logs for queries

This guide provides a complete setup for connecting your backend to MongoDB and integrating real data with your frontend, removing all mock data dependencies.