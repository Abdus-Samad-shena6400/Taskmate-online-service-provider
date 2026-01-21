/*
  Script: createOrCheckAdmin.js
  Usage: node scripts/createOrCheckAdmin.js
  - Connects to the project's MongoDB using existing config
  - Checks for user with email superuser@gmail.com
  - Creates the user with password == email and role 'Admin' if not present
  - Prints helpful messages
*/

require('dotenv').config();

// Connect using the project's dbConfig which handles connection logging and exit on failure
require('../config/dbConfig');

const User = require('../models/userModel');

async function ensureAdmin() {
  try {
    const email = 'superuser@gmail.com';
    const password = 'superuser@gmail.com';

    console.log('Checking for admin user:', email);

    let user = await User.findOne({ email }).select('+password');

    if (user) {
      console.log('Admin user already exists:', user.email);
      console.log('Role:', user.role);
      process.exit(0);
    }

    console.log('Admin user not found. Creating...');

    const newAdmin = new User({
      name: 'Super User',
      email,
      password,
      phoneNumber: '0000000000',
      role: 'Admin',
    });

    await newAdmin.save();

    console.log('Admin created successfully. Email:', email, 'Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error creating/checking admin:', err.message);
    console.error(err);
    process.exit(1);
  }
}

ensureAdmin();
