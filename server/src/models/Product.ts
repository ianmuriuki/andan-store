import mongoose, { Document, Schema } from 'mongoose';

export interface IReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  sku: string;
  barcode?: string;
  brand?: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isOrganic: boolean;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  allergens: string[];
  storage: string;
  shelfLife: number; // in days
  reviews: IReview[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  viewCount: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  calculateAverageRating(): void;
  getDiscountedPrice(): number;
  isInStock(): boolean;
  isOnSale(): boolean;
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: [500, 'Review comment cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'Fruits',
      'Vegetables',
      'Dairy',
      'Meat',
      'Seafood',
      'Beverages',
      'Bakery',
      'Snacks',
      'Frozen',
      'Pantry',
      'Health',
      'Baby',
      'Household'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'g', 'liter', 'ml', 'piece', 'pack', 'dozen', 'bunch']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 },
    sugar: { type: Number, min: 0 }
  },
  allergens: [{
    type: String,
    enum: [
      'Gluten',
      'Dairy',
      'Eggs',
      'Nuts',
      'Peanuts',
      'Soy',
      'Fish',
      'Shellfish',
      'Sesame'
    ]
  }],
  storage: {
    type: String,
    enum: ['Room Temperature', 'Refrigerated', 'Frozen'],
    default: 'Room Temperature'
  },
  shelfLife: {
    type: Number,
    min: [1, 'Shelf life must be at least 1 day'],
    default: 30
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: {
      type: Number,
      min: 0
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    }
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      lowercase: true,
      trim: true
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ sku: 1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  return this.getDiscountedPrice();
});

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function(): void {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.reviewCount = 0;
    return;
  }

  const totalRating = this.reviews.reduce((sum: number, review: IReview) => sum + review.rating, 0);
  this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10;
  this.reviewCount = this.reviews.length;
};

// Method to get discounted price
productSchema.methods.getDiscountedPrice = function(): number {
  if (!this.discount || !this.discount.isActive) {
    return this.price;
  }

  const now = new Date();
  if (now < this.discount.startDate || now > this.discount.endDate) {
    return this.price;
  }

  if (this.discount.type === 'percentage') {
    return this.price * (1 - this.discount.value / 100);
  } else {
    return Math.max(0, this.price - this.discount.value);
  }
};

// Method to check if product is in stock
productSchema.methods.isInStock = function(): boolean {
  return this.stock > 0;
};

// Method to check if product is on sale
productSchema.methods.isOnSale = function(): boolean {
  if (!this.discount || !this.discount.isActive) {
    return false;
  }

  const now = new Date();
  return now >= this.discount.startDate && now <= this.discount.endDate;
};

// Pre-save middleware to update rating when reviews change
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.calculateAverageRating();
  }
  next();
});

// Pre-save middleware to generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const categoryCode = this.category.substring(0, 3).toUpperCase();
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.sku = `${categoryCode}-${randomCode}`;
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema);