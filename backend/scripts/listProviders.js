/*
  Script: listProviders.js
  Usage: node scripts/listProviders.js
  - Connects using the project's dbConfig
  - Lists users with role 'Provider' (email, phoneNumber, createdAt)
*/

require('dotenv').config();
require('../config/dbConfig');
const User = require('../models/userModel');

async function listProviders() {
  try {
    const providers = await User.find({ role: 'Provider' }).select('name email phoneNumber createdAt');
    if (!providers || providers.length === 0) {
      console.log('No providers found in the database.');
      process.exit(0);
    }

    console.log(`Found ${providers.length} provider(s):`);
    providers.forEach((p, idx) => {
      console.log(`\n[${idx + 1}] Name: ${p.name}`);
      console.log(`    Email: ${p.email}`);
      console.log(`    Phone: ${p.phoneNumber}`);
      console.log(`    Created: ${p.createdAt}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error listing providers:', err.message);
    console.error(err);
    process.exit(1);
  }
}

listProviders();
