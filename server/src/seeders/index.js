import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedProducts } from "./productSeeder.js";
import { seedUsers } from "./userSeeder.js";
import { seedOrders } from "./orderSeeder.js";

dotenv.config();

const runSeeders = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    console.log("🌱 Starting database seeding...\n");

    // Run seeders in order (users first, then products, then orders)
    console.log("👥 Seeding users...");
    await seedUsers();
    console.log("");

    console.log("📦 Seeding products...");
    await seedProducts();
    console.log("");

    console.log("🛒 Seeding orders...");
    await seedOrders();
    console.log("");

    console.log("🎉 All seeders completed successfully!");
    console.log("📊 Database Summary:");

    // Show final statistics
    const userCount = await mongoose.model("User").countDocuments();
    const productCount = await mongoose.model("Product").countDocuments();
    const orderCount = await mongoose.model("Order").countDocuments();

    console.log(`   - Users: ${userCount}`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Orders: ${orderCount}`);

    console.log("\n🚀 You can now start the server and test the application!");
    console.log("📝 Test credentials:");
    console.log("   Admin: admin@andangrocery.com / Admin123!");
    console.log("   User: john.doe@example.com / User123!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder error:", error);
    process.exit(1);
  }
};

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
🌱 Andan Grocery Database Seeder

Usage: npm run seed [options]

Options:
  --help, -h     Show this help message
  --users        Seed only users
  --products     Seed only products  
  --orders       Seed only orders

Examples:
  npm run seed              # Seed all data
  npm run seed --users      # Seed only users
  npm run seed --products   # Seed only products
  npm run seed --orders     # Seed only orders
  `);
  process.exit(0);
}

// Run specific seeders based on arguments
const runSpecificSeeders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    if (args.includes("--users")) {
      console.log("👥 Seeding users only...");
      await seedUsers();
    } else if (args.includes("--products")) {
      console.log("📦 Seeding products only...");
      await seedProducts();
    } else if (args.includes("--orders")) {
      console.log("🛒 Seeding orders only...");
      await seedOrders();
    } else {
      // Run all seeders
      await runSeeders();
      return;
    }

    console.log("✅ Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder error:", error);
    process.exit(1);
  }
};

if (args.length > 0) {
  runSpecificSeeders();
} else {
  runSeeders();
}
