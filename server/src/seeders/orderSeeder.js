import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

export const seedOrders = async () => {
  try {
    // Clear existing orders
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing orders');

    // Get users and products for creating orders
    const users = await User.find({ role: 'user' });
    const products = await Product.find({ isActive: true });

    if (users.length === 0 || products.length === 0) {
      console.log('⚠️  No users or products found. Please seed users and products first.');
      return [];
    }

    const sampleOrders = [];

    // Create orders for each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const numOrders = Math.floor(Math.random() * 3) + 1; // 1-3 orders per user

      for (let j = 0; j < numOrders; j++) {
        // Select random products for this order
        const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items per order
        const orderItems = [];
        const selectedProducts = [];

        for (let k = 0; k < numItems; k++) {
          let randomProduct;
          do {
            randomProduct = products[Math.floor(Math.random() * products.length)];
          } while (selectedProducts.includes(randomProduct._id.toString()));

          selectedProducts.push(randomProduct._id.toString());
          
          const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
          
          orderItems.push({
            product: randomProduct._id,
            name: randomProduct.name,
            price: randomProduct.price,
            quantity: quantity,
            unit: randomProduct.unit,
            image: randomProduct.images[0]
          });
        }

        // Calculate totals
        const itemsPrice = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const taxPrice = itemsPrice * 0.16; // 16% VAT
        const shippingPrice = itemsPrice >= 2000 ? 0 : 100;
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        // Random order status
        const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Random payment status
        const paymentStatuses = ['pending', 'completed', 'failed'];
        const paymentStatus = status === 'delivered' ? 'completed' : 
                             status === 'pending' ? 'pending' : 
                             paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

        // Create order date (last 30 days)
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

        // Add this for estimated delivery
        const estimatedDelivery = new Date(orderDate);
        estimatedDelivery.setDate(orderDate.getDate() + Math.floor(Math.random() * 6) + 2); // 2-7 days later

        const order = {
          user: user._id,
          items: orderItems,
          shippingAddress: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '+254700123456',
            street: user.addresses[0]?.street || '123 Default Street',
            city: user.addresses[0]?.city || 'Nairobi',
            state: user.addresses[0]?.state || 'Nairobi County',
            zipCode: user.addresses[0]?.zipCode || '00100',
            country: user.addresses[0]?.country || 'Kenya'
          },
          paymentInfo: {
            method: 'mpesa',
            status: paymentStatus,
            amount: totalPrice,
            currency: 'KES',
            transactionId: `CHK${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            ...(paymentStatus === 'completed' && {
              mpesaReceiptNumber: `MP${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
              paidAt: orderDate
            })
          },
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          status,
          orderNumber: `ORD${Date.now()}${Math.floor(Math.random() * 10000)}`,
          estimatedDelivery,
          createdAt: orderDate,
          updatedAt: orderDate
        };

        sampleOrders.push(order);
      }
    }

    // Insert orders
    const createdOrders = await Order.insertMany(sampleOrders);
    
    console.log('✅ Orders seeded successfully');
    console.log(`📊 Created ${createdOrders.length} orders:`);
    
    // Show order statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalPrice' }
        }
      }
    ]);

    orderStats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count} orders (KSH ${stat.totalValue.toFixed(2)})`);
    });

    return createdOrders;
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    throw error;
  }
};