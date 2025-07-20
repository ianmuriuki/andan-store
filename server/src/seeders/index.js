import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedProducts }  from './productSeeder.js';

dotenv.config();

const runSeeders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    await seedProducts();
    console.log('✅ All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
};

runSeeders();