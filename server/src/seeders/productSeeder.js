import { Product } from '../models/Product.js';

const sampleProducts = [
  {
    sku: 'APPL-001',
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
    unit: 'kg', // valid enum value
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
    sku: 'MILK-001',
    name: 'Farm Fresh Milk',
    description: 'Pure, fresh milk from grass-fed cows, rich in nutrients.',
    shortDescription: 'Pure, fresh milk from grass-fed cows',
    price: 120,
    category: 'Dairy',
    images: [
      'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 30,
    unit: 'liter', // valid enum value
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
    sku: 'BREAD-001',
    name: 'Artisan Whole Grain Bread',
    description: 'Handcrafted whole grain bread baked fresh daily with organic ingredients.',
    shortDescription: 'Handcrafted whole grain bread',
    price: 180,
    category: 'Bakery',
    images: [
      'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 25,
    unit: 'piece', // changed from 'loaf' to 'piece'
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
    sku: 'SPIN-001',
    name: 'Fresh Baby Spinach',
    description: 'Tender baby spinach leaves, perfect for salads and cooking.',
    shortDescription: 'Tender baby spinach leaves',
    price: 89,
    category: 'Vegetables',
    images: [
      'https://images.pexels.com/photos/2068303/pexels-photo-2068303.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 40,
    unit: 'bunch', // valid enum value
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
    sku: 'BSTK-001',
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
    unit: 'kg', // valid enum value
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
    sku: 'OJ-001',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice, no preservatives added.',
    shortDescription: 'Freshly squeezed orange juice',
    price: 250,
    category: 'Beverages',
    images: [
      'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 35,
    unit: 'liter', // valid enum value
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