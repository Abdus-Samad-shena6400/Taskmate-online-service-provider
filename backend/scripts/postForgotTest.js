// Simple Node script to POST JSON to the forgot password endpoint
const http = require('http');

const data = JSON.stringify({ email: 'provider@gmail.com' });

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 4001,
  path: '/api/users/password/forgot',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try { console.log('Body:', JSON.parse(body)); } catch(e) { console.log('Body:', body); }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  process.exit(1);
});

req.write(data);
req.end();
