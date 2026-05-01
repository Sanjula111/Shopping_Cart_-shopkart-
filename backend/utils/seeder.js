const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

dotenv.config();

const categories = [
  { name: 'Vegetables', description: 'Fresh organic vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400' },
  { name: 'Fruits', description: 'Seasonal fresh fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400' },
  { name: 'Cakes', description: 'Freshly baked cakes', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { name: 'Biscuits', description: 'Crispy biscuits and cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shopkart.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`✅ Admin created: ${admin.email} / Admin@123`);

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@shopkart.com',
      password: 'User@123',
    });
    console.log('✅ Test user created: user@shopkart.com / User@123');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categories created`);

    // Create products
    const catMap = {};
    createdCategories.forEach((c) => { catMap[c.name] = c._id; });

    const products = [
      // Vegetables
      { name: 'Fresh Tomatoes', description: 'Ripe red tomatoes, perfect for cooking and salads.', price: 120, originalPrice: 150, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', category: catMap['Vegetables'], stock: 100, unit: 'kg' },
      { name: 'Green Spinach', description: 'Tender baby spinach leaves, rich in iron.', price: 80, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', category: catMap['Vegetables'], stock: 50, unit: 'bunch' },
      { name: 'Carrots', description: 'Crunchy orange carrots, great for cooking.', price: 60, originalPrice: 80, image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400', category: catMap['Vegetables'], stock: 80, unit: 'kg' },
      { name: 'Broccoli', description: 'Fresh green broccoli, packed with nutrients.', price: 200, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', category: catMap['Vegetables'], stock: 40, unit: 'piece' },
      // Fruits
      { name: 'Sweet Mangoes', description: 'Alphonso mangoes, the king of fruits.', price: 350, originalPrice: 400, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400', category: catMap['Fruits'], stock: 60, unit: 'dozen' },
      { name: 'Strawberries', description: 'Fresh red strawberries, sweet and tangy.', price: 280, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', category: catMap['Fruits'], stock: 30, unit: 'box' },
      { name: 'Bananas', description: 'Ripe yellow bananas, perfect for everyday.', price: 60, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', category: catMap['Fruits'], stock: 120, unit: 'dozen' },
      { name: 'Watermelon', description: 'Juicy summer watermelon, refreshing treat.', price: 150, image: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400', category: catMap['Fruits'], stock: 25, unit: 'piece' },
      // Cakes
      { name: 'Chocolate Truffle Cake', description: 'Rich dark chocolate truffle cake with ganache frosting.', price: 850, originalPrice: 1000, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', category: catMap['Cakes'], stock: 15, unit: 'piece' },
      { name: 'Vanilla Sponge Cake', description: 'Light and fluffy vanilla sponge with whipped cream.', price: 650, image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400', category: catMap['Cakes'], stock: 20, unit: 'piece' },
      { name: 'Red Velvet Cake', description: 'Classic red velvet with cream cheese frosting.', price: 950, image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400', category: catMap['Cakes'], stock: 10, unit: 'piece' },
      // Biscuits
      { name: 'Butter Cookies', description: 'Crispy melt-in-mouth butter cookies.', price: 180, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', category: catMap['Biscuits'], stock: 50, unit: 'pack' },
      { name: 'Chocolate Chip Cookies', description: 'Classic cookies loaded with chocolate chips.', price: 220, originalPrice: 250, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400', category: catMap['Biscuits'], stock: 45, unit: 'pack' },
      { name: 'Digestive Biscuits', description: 'Wholesome wheat digestive biscuits.', price: 120, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', category: catMap['Biscuits'], stock: 80, unit: 'pack' },
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products created`);
    console.log('\n🎉 Database seeded successfully!');
    console.log('Admin: admin@shopkart.com | Admin@123');
    console.log('User:  user@shopkart.com  | User@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
