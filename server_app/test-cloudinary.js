// Test script để kiểm tra Cloudinary config
require('dotenv').config();

console.log('=== CLOUDINARY CONFIG TEST ===');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'NOT SET');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('\n=== Testing Cloudinary Connection ===');
cloudinary.api.ping()
    .then(result => {
        console.log('✅ Cloudinary connection successful!');
        console.log('Response:', result);
    })
    .catch(error => {
        console.log('❌ Cloudinary connection failed!');
        console.error('Error:', error.message);
    });
