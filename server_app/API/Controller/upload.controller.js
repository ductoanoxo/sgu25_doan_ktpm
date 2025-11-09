const { cloudinary, deleteImage, getPublicIdFromUrl } = require('../../config/cloudinary');

/**
 * Upload một ảnh
 */
const uploadImage = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
        }

        // Cloudinary tự động upload qua multer middleware
        const imageUrl = req.file.path; // URL từ Cloudinary
        const publicId = req.file.filename; // Public ID

        res.status(200).json({
            success: true,
            message: 'Upload ảnh thành công',
            data: {
                url: imageUrl,
                publicId: publicId,
                width: req.file.width,
                height: req.file.height
            }
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

/**
 * Upload nhiều ảnh
 */
const uploadMultipleImages = async(req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
        }

        const images = req.files.map(file => ({
            url: file.path,
            publicId: file.filename,
            width: file.width,
            height: file.height
        }));

        res.status(200).json({
            success: true,
            message: `Upload ${images.length} ảnh thành công`,
            data: images
        });
    } catch (error) {
        console.error('Upload multiple images error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

/**
 * Xóa ảnh
 */
const removeImage = async(req, res) => {
    try {
        const { publicId, imageUrl } = req.body;

        let targetPublicId = publicId;

        // Nếu không có publicId, thử extract từ URL
        if (!targetPublicId && imageUrl) {
            targetPublicId = getPublicIdFromUrl(imageUrl);
        }

        if (!targetPublicId) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp publicId hoặc imageUrl'
            });
        }

        const result = await deleteImage(targetPublicId);

        if (result.result === 'ok' || result.result === 'not found') {
            res.status(200).json({
                success: true,
                message: 'Xóa ảnh thành công',
                data: result
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Không thể xóa ảnh',
                data: result
            });
        }
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa ảnh',
            error: error.message
        });
    }
};

module.exports = {
    uploadImage,
    uploadMultipleImages,
    removeImage
};