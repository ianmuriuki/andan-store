import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

const sampleUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@andangrocery.com',
    password: 'Admin123!',
    role: 'admin',
    phone: '+254700000001',
    isVerified: true,
    addresses: [
      {
        street: '123 Admin Street, Suite 100',
        city: 'Nairobi',
        state: 'Nairobi County',
        zipCode: '00100',
        country: 'Kenya',
        isDefault: true
      }
    ]
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'User123!',
    role: 'user',
    phone: '+254700000002',
    isVerified: true,
    addresses: [
      {
        street: '456 Residential Road, Apt 2B',
        city: 'Nairobi',
        state: 'Nairobi County',
        zipCode: '00200',
        country: 'Kenya',
        isDefault: true
      }
    ]
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'User123!',
    role: 'user',
    phone: '+254700000003',
    isVerified: true,
    addresses: [
      {
        street: '789 Garden Avenue',
        city: 'Nairobi',
        state: 'Nairobi County',
        zipCode: '00300',
        country: 'Kenya',
        isDefault: true
      }
    ]
  },
  {
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    password: 'User123!',
    role: 'user',
    phone: '+254700000004',
    isVerified: true,
    addresses: [
      {
        street: '321 Market Street',
        city: 'Mombasa',
        state: 'Mombasa County',
        zipCode: '80100',
        country: 'Kenya',
        isDefault: true
      }
    ]
  },
  {
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@example.com',
    password: 'User123!',
    role: 'user',
    phone: '+254700000005',
    isVerified: true,
    addresses: [
      {
        street: '654 Valley View',
        city: 'Kisumu',
        state: 'Kisumu County',
        zipCode: '40100',
        country: 'Kenya',
        isDefault: true
      }
    ]
  }
];

export const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Hash passwords before inserting
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return {
          ...user,
          password: hashedPassword,
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
    );

    // Insert sample users
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    
    console.log('✅ Users seeded successfully');
    console.log(`📊 Created ${createdUsers.length} users:`);
    createdUsers.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) - ${user.role}`);
    });

    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};