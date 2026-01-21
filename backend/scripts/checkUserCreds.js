/*
  Script: checkUserCreds.js
  Usage: node scripts/checkUserCreds.js [email] [password]
  - Connects using project's dbConfig
  - Finds the user by email and checks if the provided password matches
*/

require('dotenv').config();
require('../config/dbConfig');
const User = require('../models/userModel');

async function checkCreds() {
  const email = process.argv[2] || 'provider@gmail.com';
  const password = process.argv[3] || 'provider123';

  try {
    console.log(`Checking credentials for ${email}`);
    const user = await User.findOne({ email }).select('+password role');
    if (!user) {
      console.log('User not found.');
      process.exit(0);
    }
    console.log('User found. Role:', user.role);
    const ok = await user.comparePassword(password);
    if (ok) {
      console.log('Password MATCHES');
    } else {
      console.log('Password does NOT match');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error checking credentials:', err.message);
    console.error(err);
    process.exit(1);
  }
}

checkCreds();
