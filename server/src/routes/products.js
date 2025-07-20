import express from 'express';
import { body, query } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts
} from '../controllers/productController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const createProductValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Seafood', 'Beverages', 'Bakery', 'Snacks', 'Frozen', 'Pantry', 'Health', 'Baby', 'Household'])
    .withMessage('Invalid category'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('unit')
    .isIn(['kg', 'g', 'liter', 'ml', 'piece', 'pack', 'dozen', 'bunch'])
    .withMessage('Invalid unit'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required')
];

const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

const addReviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Comment must be between 5 and 500 characters')
];

const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query cannot be empty'),
  query('category')
    .optional()
    .isIn(['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Seafood', 'Beverages', 'Bakery', 'Snacks', 'Frozen', 'Pantry', 'Health', 'Baby', 'Household'])
    .withMessage('Invalid category'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Public routes
router.get('/', searchValidation, validate, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchValidation, validate, searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Protected routes
router.post('/:id/reviews', auth, addReviewValidation, validate, addReview);

// Admin routes
router.post('/', adminAuth, createProductValidation, validate, createProduct);
router.put('/:id', adminAuth, updateProductValidation, validate, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

export default router;