const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Lead = require('../models/Lead');
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();

    // Find or create test user
    let testUser = await User.findOne({ email: 'test@leadflow.local' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@leadflow.local',
        password: 'Password123'
      });
      console.log('Test user created');
    } else {
      console.log('Test user already exists:', testUser.email);
    }

    // Remove old leads for test user
    await Lead.deleteMany({ owner: testUser._id });
    console.log('Old leads cleared for test user');

    // Seed 50 new leads
    const leads = Array.from({ length: 50 }).map(() => ({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email().toLowerCase() + Date.now() + Math.floor(Math.random() * 1000) + '@dummy.com',
      phone: faker.phone.number('##########'),
      company: faker.company.name(),
      city: faker.location.city(),
      state: faker.location.state(),
      source: faker.helpers.arrayElement(['website','facebook_ads','google_ads','referral','events','other']), 
      status: faker.helpers.arrayElement(['new','contacted','qualified','lost','won']),
      score: Math.floor(Math.random() * 101),
      lead_value: Math.floor(Math.random() * 10000),
      is_qualified: faker.datatype.boolean(),
      owner: testUser._id
    }));

    await Lead.insertMany(leads);
    console.log(`Seeded ${leads.length} leads successfully for test user`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding leads:', err);
    process.exit(1);
  }
};

seed();
