# Andan Grocery E-Commerce Database Schema

## Overview
This document outlines the complete database schema for the Andan Grocery E-Commerce system using MongoDB with Mongoose ODM.

## Collections Structure

### 1. Users Collection
Stores customer and admin user information with authentication details.

```javascript
{
  _id: ObjectId,
  firstName: String (required, 2-50 chars),
  lastName: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (required, hashed, min 6 chars),
  phone: String (optional, validated format),
  avatar: String (optional, image URL),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isVerified: Boolean (default: false),
  addresses: [
    {
      street: String (required),
      city: String (required),
      state: String (required),
      zipCode: String (required),
      country: String (default: 'Kenya'),
      isDefault: Boolean (default: false)
    }
  ],
  preferences: {
    notifications: {
      email: Boolean (default: true),
      sms: Boolean (default: false),
      push: Boolean (default: true)
    },
    language: String (default: 'en'),
    currency: String (default: 'KES')
  },
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email: 1` (unique)
- `role: 1`
- `createdAt: -1`

**Methods:**
- `comparePassword(candidatePassword)` - Compare hashed passwords
- `getFullName()` - Return full name string

### 2. Products Collection
Stores all product information including inventory, pricing, and metadata.

```javascript
{
  _id: ObjectId,
  name: String (required, max 200 chars),
  description: String (required, max 2000 chars),
  shortDescription: String (max 300 chars),
  price: Number (required, min 0),
  originalPrice: Number (optional, min 0),
  category: String (required, enum: [
    'Fruits', 'Vegetables', 'Dairy', 'Meat', 'Seafood',
    'Beverages', 'Bakery', 'Snacks', 'Frozen', 'Pantry',
    'Health', 'Baby', 'Household'
  ]),
  subcategory: String,
  images: [String] (required, array of image URLs),
  stock: Number (required, min 0, default 0),
  unit: String (required, enum: [
    'kg', 'g', 'liter', 'ml', 'piece', 'pack', 'dozen', 'bunch'
  ]),
  weight: Number (optional, min 0),
  dimensions: {
    length: Number (min 0),
    width: Number (min 0),
    height: Number (min 0)
  },
  sku: String (required, unique, uppercase),
  barcode: String,
  brand: String,
  tags: [String] (lowercase, trimmed),
  isActive: Boolean (default: true),
  isFeatured: Boolean (default: false),
  isOrganic: Boolean (default: false),
  nutritionalInfo: {
    calories: Number (min 0),
    protein: Number (min 0),
    carbs: Number (min 0),
    fat: Number (min 0),
    fiber: Number (min 0),
    sugar: Number (min 0)
  },
  allergens: [String] (enum: [
    'Gluten', 'Dairy', 'Eggs', 'Nuts', 'Peanuts',
    'Soy', 'Fish', 'Shellfish', 'Sesame'
  ]),
  storage: String (enum: [
    'Room Temperature', 'Refrigerated', 'Frozen'
  ], default: 'Room Temperature'),
  shelfLife: Number (min 1, default 30), // days
  reviews: [
    {
      user: ObjectId (ref: 'User'),
      rating: Number (required, min 1, max 5),
      comment: String (required, max 500 chars),
      createdAt: Date
    }
  ],
  rating: Number (default 0, min 0, max 5),
  reviewCount: Number (default 0),
  salesCount: Number (default 0),
  viewCount: Number (default 0),
  discount: {
    type: String (enum: ['percentage', 'fixed']),
    value: Number (min 0),
    startDate: Date,
    endDate: Date,
    isActive: Boolean (default: false)
  },
  seo: {
    metaTitle: String (max 60 chars),
    metaDescription: String (max 160 chars),
    keywords: [String] (lowercase, trimmed)
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `name: 'text', description: 'text', tags: 'text'` (text search)
- `category: 1, isActive: 1`
- `price: 1`
- `rating: -1`
- `salesCount: -1`
- `createdAt: -1`
- `isFeatured: 1, isActive: 1`
- `sku: 1` (unique)

**Methods:**
- `calculateAverageRating()` - Update rating based on reviews
- `getDiscountedPrice()` - Calculate price with active discounts
- `isInStock()` - Check if product has stock
- `isOnSale()` - Check if product has active discount

### 3. Orders Collection
Stores all order information including items, shipping, and payment details.

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  orderNumber: String (required, unique),
  items: [
    {
      product: ObjectId (ref: 'Product', required),
      name: String (required),
      price: Number (required, min 0),
      quantity: Number (required, min 1),
      unit: String (required),
      image: String (required)
    }
  ],
  shippingAddress: {
    firstName: String (required),
    lastName: String (required),
    email: String (required),
    phone: String (required),
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (default: 'Kenya'),
    instructions: String
  },
  paymentInfo: {
    method: String (enum: ['mpesa', 'card', 'cash'], required),
    transactionId: String,
    mpesaReceiptNumber: String,
    status: String (enum: [
      'pending', 'completed', 'failed', 'refunded'
    ], default: 'pending'),
    amount: Number (required, min 0),
    currency: String (default: 'KES'),
    paidAt: Date
  },
  itemsPrice: Number (required, min 0),
  taxPrice: Number (required, min 0, default 0),
  shippingPrice: Number (required, min 0, default 0),
  totalPrice: Number (required, min 0),
  status: String (enum: [
    'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  ], default: 'pending'),
  deliveryDate: Date,
  estimatedDelivery: Date (required),
  notes: String,
  trackingNumber: String,
  cancelReason: String,
  refundAmount: Number (min 0),
  refundReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `user: 1, createdAt: -1`
- `orderNumber: 1` (unique)
- `status: 1`
- `paymentInfo.status: 1`
- `createdAt: -1`

**Methods:**
- `generateOrderNumber()` - Generate unique order number
- `calculateTotals()` - Calculate all price totals
- `canBeCancelled()` - Check if order can be cancelled
- `canBeRefunded()` - Check if order can be refunded

### 4. Categories Collection (Optional)
For dynamic category management.

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  slug: String (required, unique),
  description: String,
  image: String,
  icon: String,
  parentCategory: ObjectId (ref: 'Category'),
  isActive: Boolean (default: true),
  sortOrder: Number (default: 0),
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Promotions Collection
For managing discounts, coupons, and special offers.

```javascript
{
  _id: ObjectId,
  name: String (required),
  code: String (unique, uppercase),
  type: String (enum: [
    'percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y'
  ], required),
  value: Number (required, min 0),
  description: String,
  conditions: {
    minimumOrderAmount: Number (min 0),
    maximumDiscount: Number (min 0),
    applicableProducts: [ObjectId] (ref: 'Product'),
    applicableCategories: [String],
    firstTimeCustomersOnly: Boolean (default: false),
    usageLimit: Number (min 1),
    usagePerCustomer: Number (min 1)
  },
  startDate: Date (required),
  endDate: Date (required),
  isActive: Boolean (default: true),
  usageCount: Number (default: 0),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Reviews Collection (Alternative to embedded reviews)
For standalone review management.

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  product: ObjectId (ref: 'Product', required),
  order: ObjectId (ref: 'Order'),
  rating: Number (required, min 1, max 5),
  title: String,
  comment: String (required, max 1000 chars),
  images: [String],
  isVerified: Boolean (default: false),
  helpfulVotes: Number (default: 0),
  reportCount: Number (default: 0),
  isApproved: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Cart Collection (Optional - for persistent carts)
For storing user carts across sessions.

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  items: [
    {
      product: ObjectId (ref: 'Product', required),
      quantity: Number (required, min 1),
      addedAt: Date (default: Date.now)
    }
  ],
  updatedAt: Date,
  expiresAt: Date (TTL index)
}
```

## Relationships

### One-to-Many Relationships
- **User → Orders**: One user can have many orders
- **User → Reviews**: One user can write many reviews
- **Product → Reviews**: One product can have many reviews
- **Category → Products**: One category can have many products

### Many-to-Many Relationships
- **Products ↔ Promotions**: Products can be in multiple promotions, promotions can apply to multiple products
- **Users ↔ Products** (via Cart): Users can have multiple products in cart

### Embedded Documents
- **User.addresses**: User addresses embedded in user document
- **Product.reviews**: Product reviews embedded in product document
- **Order.items**: Order items embedded in order document

## Data Validation Rules

### User Validation
- Email must be unique and valid format
- Password minimum 6 characters with complexity requirements
- Phone number must be valid international format
- Only one default address per user

### Product Validation
- SKU must be unique and auto-generated if not provided
- Price must be positive number
- Stock cannot be negative
- Images array must have at least one image
- Category must be from predefined enum

### Order Validation
- Order number auto-generated and unique
- Total price calculated automatically
- Estimated delivery calculated based on location
- Payment status tracked through lifecycle

## Performance Considerations

### Indexing Strategy
- Compound indexes for common query patterns
- Text indexes for search functionality
- TTL indexes for temporary data (carts, sessions)

### Data Archiving
- Archive old orders after 2 years
- Soft delete for products (isActive: false)
- Regular cleanup of expired promotions

### Caching Strategy
- Cache frequently accessed products
- Cache category hierarchies
- Cache user sessions and cart data

## Security Measures

### Data Protection
- Password hashing with bcrypt (12 rounds)
- Sensitive data excluded from API responses
- Input validation and sanitization
- Rate limiting on authentication endpoints

### Access Control
- Role-based permissions (user/admin)
- JWT token authentication
- Secure session management
- API endpoint protection

This schema provides a robust foundation for the Andan Grocery E-Commerce system with proper relationships, validation, and performance optimization.