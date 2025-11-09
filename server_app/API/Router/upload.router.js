const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple } = require('../../config/cloudinary');
const {
    uploadImage,
    uploadMultipleImages,
    removeImage
} = require('../Controller/upload.controller');

/**
 * @route   POST /api/upload/single
 * @desc    Upload một ảnh
 * @access  Public (có thể thêm middleware auth nếu cần)
 */
router.post('/single', uploadSingle, uploadImage);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload nhiều ảnh (tối đa 10)
 * @access  Public
 */
router.post('/multiple', uploadMultiple, uploadMultipleImages);

/**
 * @route   DELETE /api/upload/remove
 * @desc    Xóa ảnh từ Cloudinary
 * @access  Public
 * @body    { publicId: string } hoặc { imageUrl: string }
 */
router.delete('/remove', removeImage);

module.exports = router;