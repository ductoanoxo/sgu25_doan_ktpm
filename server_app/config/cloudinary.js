const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình storage cho Multer với Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'fashion-shop', // Thư mục lưu trữ trên Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Giới hạn kích thước
    }
});

// Middleware upload với Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    },
    fileFilter: (req, file, cb) => {
        // Kiểm tra loại file
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
        }
    }
});

/**
 * Upload một ảnh
 */
const uploadSingle = upload.single('image');

/**
 * Upload nhiều ảnh
 */
const uploadMultiple = upload.array('images', 10); // Tối đa 10 ảnh

/**
 * Xóa ảnh từ Cloudinary
 * @param {string} publicId - Public ID của ảnh trên Cloudinary
 * @returns {Promise}
 */
const deleteImage = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

/**
 * Lấy public_id từ URL Cloudinary
 * @param {string} imageUrl - URL của ảnh
 * @returns {string} - Public ID
 */
const getPublicIdFromUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const parts = imageUrl.split('/');
    const fileWithExt = parts[parts.length - 1];
    const publicId = fileWithExt.split('.')[0];

    // Lấy folder path nếu có
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1 && uploadIndex < parts.length - 2) {
        const folders = parts.slice(uploadIndex + 2, -1);
        return folders.length > 0 ? `${folders.join('/')}/${publicId}` : publicId;
    }

    return publicId;
};

module.exports = {
    cloudinary,
    uploadSingle,
    uploadMultiple,
    deleteImage,
    getPublicIdFromUrl
};