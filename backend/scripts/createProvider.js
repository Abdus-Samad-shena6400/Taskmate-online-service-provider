/*
  Script: createProvider.js
  Usage: node scripts/createProvider.js [email] [password]
  - Creates a Provider user if not present
*/

require('dotenv').config();
require('../config/dbConfig');
const User = require('../models/userModel');

async function createProvider() {
  const email = process.argv[2] || 'provider@gmail.com';
  const password = process.argv[3] || 'provider123';

  try {
    console.log(`Ensuring provider exists: ${email}`);
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Provider already exists:', existing.email);
      process.exit(0);
    }

    const newUser = new User({
      name: 'Provider User',
      email,
      password,
      phoneNumber: '03000000000',
      role: 'Provider'
    });

    await newUser.save();
    console.log('Provider created. Email:', email, 'Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error creating provider:', err.message);
    console.error(err);
    process.exit(1);
  }
}

createProvider();
