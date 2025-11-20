// Simple test to upload image to Cloudinary
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

console.log('=== CLOUDINARY UPLOAD TEST ===\n');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***SET***' : 'NOT SET');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test 1: Ping Cloudinary
console.log('\n=== TEST 1: Ping Cloudinary ===');
cloudinary.api.ping()
    .then(result => {
        console.log('✅ Ping successful:', result);

        // Test 2: Upload a test image
        console.log('\n=== TEST 2: Upload Test Image ===');

        // Create a simple test buffer (1x1 pixel transparent PNG)
        const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        // Upload using upload_stream
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                    folder: 'fashion-shop/products',
                    resource_type: 'image',
                    public_id: 'test-upload-' + Date.now()
                },
                (error, result) => {
                    if (error) {
                        console.log('❌ Upload failed:', error);
                        reject(error);
                    } else {
                        console.log('✅ Upload successful!');
                        console.log('URL:', result.secure_url);
                        console.log('Public ID:', result.public_id);
                        resolve(result);
                    }
                }
            );
            uploadStream.end(testImageBuffer);
        });
    })
    .then(result => {
        console.log('\n=== All tests passed! ===');
        console.log('You can now upload images to Cloudinary');
    })
    .catch(error => {
        console.log('\n❌ Test failed!');
        console.error('Error:', error.message || error);
    });