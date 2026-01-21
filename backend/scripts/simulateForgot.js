// Simulate calling the forgotPassword controller directly
require('dotenv').config();
require('../config/dbConfig');
const { forgotPassword } = require('../controllers/userController');

const email = process.argv[2] || 'provider@gmail.com';

const req = {
  body: { email },
  protocol: 'http',
  get: (k) => 'localhost:4000'
};

const res = {
  status(code) {
    this._code = code;
    return this;
  },
  json(payload) {
    console.log('Response status:', this._code || 200);
    console.log('Response payload:', payload);
    return this;
  }
};

forgotPassword(req, res).then(() => process.exit(0)).catch(err => { console.error('Controller error:', err); process.exit(1); });
