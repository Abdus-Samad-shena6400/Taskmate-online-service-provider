/*
  Script: testProviderPasswords.js
  Usage: node scripts/testProviderPasswords.js
  - Connects using project's dbConfig
  - Loads providers and tries common passwords (email, phoneNumber, 'password', '12345678')
  - Prints which candidate matches (if any)
*/

require('dotenv').config();
require('../config/dbConfig');
const User = require('../models/userModel');

async function testPasswords() {
  try {
    const providers = await User.find({ role: 'Provider' }).select('+password phoneNumber email name');
    if (!providers || providers.length === 0) {
      console.log('No providers found.');
      process.exit(0);
    }

    const candidates = (p) => [
      p.email,
      p.phoneNumber,
      'password',
      '12345678',
      'provider123',
      '123456789',
    ];

    for (const p of providers) {
      console.log('\nChecking provider:', p.name, '<' + p.email + '>');
      let matched = false;
      for (const cand of candidates(p)) {
        if (!cand) continue;
        const ok = await p.comparePassword(cand).catch(() => false);
        if (ok) {
          console.log(`  MATCH -> password: "${cand}"`);
          matched = true;
          break;
        } else {
          console.log(`  tried: "${cand}" -> no`);
        }
      }
      if (!matched) console.log('  No common password matched for this provider.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error testing provider passwords:', err.message);
    console.error(err);
    process.exit(1);
  }
}

testPasswords();
