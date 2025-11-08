const Favorite = require('../../Models/favorite');
const Product = require('../../Models/product');

// FR-021: Thêm sản phẩm vào wishlist
module.exports.addToFavorite = async(req, res) => {
    try {
        const { id_user, id_product } = req.body;

        if (!id_user || !id_product) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Product ID are required'
            });
        }

        // Kiểm tra xem sản phẩm đã có trong wishlist chưa
        const existingFavorite = await Favorite.findOne({
            id_user: id_user,
            id_product: id_product
        });

        if (existingFavorite) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }

        // Kiểm tra xem product có tồn tại không
        const product = await Product.findById(id_product);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Thêm vào wishlist
        const newFavorite = new Favorite({
            id_user: id_user,
            id_product: id_product
        });

        await newFavorite.save();

        res.status(201).json({
            success: true,
            message: 'Product added to wishlist successfully',
            data: newFavorite
        });

    } catch (error) {
        console.error('Error adding to favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// FR-022: Xóa sản phẩm khỏi wishlist
module.exports.removeFromFavorite = async(req, res) => {
    try {
        const { id } = req.params; // Favorite ID
        const { id_user } = req.body;

        if (!id_user) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Tìm và xóa favorite
        const favorite = await Favorite.findOneAndDelete({
            _id: id,
            id_user: id_user
        });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist successfully'
        });

    } catch (error) {
        console.error('Error removing from favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// FR-022: Xóa sản phẩm khỏi wishlist bằng product ID
module.exports.removeByProduct = async(req, res) => {
    try {
        const { id_user, id_product } = req.body;

        if (!id_user || !id_product) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Product ID are required'
            });
        }

        const favorite = await Favorite.findOneAndDelete({
            id_user: id_user,
            id_product: id_product
        });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Product not in wishlist'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist successfully'
        });

    } catch (error) {
        console.error('Error removing from favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// FR-023: Xem danh sách wishlist
module.exports.getFavoritesByUser = async(req, res) => {
    try {
        const { id_user } = req.params;

        if (!id_user) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Lấy danh sách favorites với thông tin sản phẩm đầy đủ
        const favorites = await Favorite.find({ id_user: id_user })
            .populate('id_product')
            .sort({ _id: -1 }); // Sort by newest first

        // Filter out favorites where product doesn't exist (deleted products)
        const validFavorites = favorites.filter(fav => fav.id_product !== null);

        res.status(200).json({
            success: true,
            count: validFavorites.length,
            data: validFavorites
        });

    } catch (error) {
        console.error('Error getting favorites:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Kiểm tra xem sản phẩm có trong wishlist không
module.exports.checkFavorite = async(req, res) => {
    try {
        const { id_user, id_product } = req.query;

        if (!id_user || !id_product) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Product ID are required'
            });
        }

        const favorite = await Favorite.findOne({
            id_user: id_user,
            id_product: id_product
        });

        res.status(200).json({
            success: true,
            isFavorite: favorite !== null,
            data: favorite
        });

    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Đếm số lượng sản phẩm trong wishlist
module.exports.countFavorites = async(req, res) => {
    try {
        const { id_user } = req.params;

        if (!id_user) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const count = await Favorite.countDocuments({ id_user: id_user });

        res.status(200).json({
            success: true,
            count: count
        });

    } catch (error) {
        console.error('Error counting favorites:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};