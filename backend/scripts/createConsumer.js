/*
  Script: createConsumer.js
  Usage: node scripts/createConsumer.js [email] [password]
  - Creates a Consumer user if not present
*/

require('dotenv').config();
require('../config/dbConfig');
const User = require('../models/userModel');

async function createConsumer() {
  const email = process.argv[2] || 'consumer@gmail.com';
  const password = process.argv[3] || 'consumer@123';

  try {
    console.log(`Ensuring consumer exists: ${email}`);
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Consumer already exists:', existing.email);
      process.exit(0);
    }

    const newUser = new User({
      name: 'Consumer User',
      email,
      password,
      phoneNumber: '03123456789',
      role: 'Consumer'
    });

    await newUser.save();
    console.log('Consumer created. Email:', email, 'Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error creating consumer:', err.message);
    console.error(err);
    process.exit(1);
  }
}

createConsumer();