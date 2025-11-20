const express = require('express');
const router = express.Router();
const FavoriteController = require('../Controller/favorite.controller');

// FR-021: Thêm sản phẩm vào wishlist
router.post('/add', FavoriteController.addToFavorite);

// FR-022: Xóa sản phẩm khỏi wishlist (by favorite ID)
router.delete('/:id', FavoriteController.removeFromFavorite);

// FR-022: Xóa sản phẩm khỏi wishlist (by product ID)
router.post('/remove', FavoriteController.removeByProduct);

// FR-023: Xem danh sách wishlist của user
router.get('/user/:id_user', FavoriteController.getFavoritesByUser);

// Kiểm tra sản phẩm có trong wishlist không
router.get('/check', FavoriteController.checkFavorite);

// Đếm số lượng sản phẩm trong wishlist
router.get('/count/:id_user', FavoriteController.countFavorites);

module.exports = router;