import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteAPI from '../API/FavoriteAPI';
import CartsLocal from '../Share/CartsLocal';
import { changeCount } from '../Redux/Action/ActionCount';
import './Favorite.css';

function Favorite(props) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const dispatch = useDispatch();
    
    // Get user ID from Redux - try both sources
    const id_user_cart = useSelector(state => state.Cart.id_user)
    const id_user_session = useSelector(state => state.Session?.idUser)
    
    // Use whichever is available, or fall back to sessionStorage
    const id_user = id_user_cart || id_user_session || sessionStorage.getItem('id_user')
    
    console.log('Favorite component - id_user_cart:', id_user_cart); // Debug
    console.log('Favorite component - id_user_session:', id_user_session); // Debug
    console.log('Favorite component - sessionStorage:', sessionStorage.getItem('id_user')); // Debug
    console.log('Favorite component - final id_user:', id_user); // Debug

    useEffect(() => {
        // Load favorites if user is logged in
        console.log('useEffect - id_user:', id_user); // Debug log
        if (id_user) {
            loadFavorites(id_user);
        } else {
            console.log('No id_user, setting loading to false'); // Debug log
            setLoading(false);
        }
    }, [id_user]);

    const loadFavorites = async (userId) => {
        try {
            console.log('Loading favorites for user:', userId); // Debug log
            setLoading(true);
            
            const response = await FavoriteAPI.getFavoritesByUser(userId);
            console.log('Favorites response:', response); // Debug log
            
            // Check response structure
            if (response && response.data) {
                console.log('Found data array with', response.data.length, 'items'); // Debug log
                setFavorites(response.data);
            } else if (response && Array.isArray(response)) {
                console.log('Response is array with', response.length, 'items'); // Debug log
                setFavorites(response);
            } else {
                console.log('Unexpected response structure:', response); // Debug log
                setFavorites([]);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            console.error('Error details:', error.response); // Debug log
            alert('Không thể tải danh sách yêu thích: ' + (error.response?.data?.message || error.message));
            setFavorites([]); // Set empty array on error
        } finally {
            console.log('Setting loading to false'); // Debug log
            setLoading(false);
        }
    };

    const handleRemove = async (favoriteId) => {
        if (!id_user) return;

        try {
            await FavoriteAPI.removeFromFavorite(favoriteId, id_user);
            // Remove from state
            setFavorites(favorites.filter(fav => fav._id !== favoriteId));
            alert('Đã xóa khỏi danh sách yêu thích');
        } catch (error) {
            console.error('Error removing favorite:', error);
            alert('Không thể xóa sản phẩm');
        }
    };

    const handleAddToCart = async (product) => {
        if (!id_user) {
            alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return;
        }

        if (product.number === 0) {
            alert('Sản phẩm đã hết hàng');
            return;
        }

        try {
            // Get sale price
            const salePrice = getSalePrice(product);
            
            // Prepare cart data
            const data = {
                id_cart: Math.random().toString(),
                id_product: product._id,
                name_product: product.name_product,
                price_product: salePrice,
                count: 1,
                image: product.image,
                size: 'M', // Default size, can be made dynamic
            };

            // Add to cart using localStorage
            CartsLocal.addProduct(data);

            // Dispatch action to update cart count
            const action_count_change = changeCount(Math.random());
            dispatch(action_count_change);

            alert('Đã thêm sản phẩm vào giỏ hàng');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Không thể thêm vào giỏ hàng');
        }
    };

    // Format price
    const formatPrice = (price) => {
        return price ? price.toLocaleString('vi-VN') + ' VND' : '0 VND';
    };

    // Get sale price
    const getSalePrice = (product) => {
        if (!product) return 0;
        if (product.id_sale && product.id_sale.sale > 0) {
            return product.price_product - (product.price_product * product.id_sale.sale) / 100;
        }
        return product.price_product;
    };

    // Get stock status
    const getStockStatus = (number) => {
        if (number === 0) return { text: 'Hết hàng', className: 'out-stock' };
        if (number < 5) return { text: `Chỉ còn ${number}`, className: 'low-stock' };
        return { text: 'Còn hàng', className: 'in-stock' };
    };

    if (loading) {
        return (
            <div className="container text-center" style={{ padding: '100px 0' }}>
                <div className="spinner-border text-warning" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-3">Đang tải danh sách yêu thích...</p>
            </div>
        );
    }

    // Check if user is logged in
    if (!id_user) {
        return (
            <div className="container text-center" style={{ padding: '100px 0' }}>
                <i className="fa fa-user-times" style={{ fontSize: '80px', color: '#dc3545' }}></i>
                <h3 className="mt-4">Vui lòng đăng nhập</h3>
                <p className="text-muted">Bạn cần đăng nhập để xem danh sách yêu thích</p>
                <p className="text-muted">Debug: id_user = {String(id_user)}</p>
                <p className="text-muted">sessionStorage = {sessionStorage.getItem('id_user')}</p>
                <Link to="/login" className="btn btn-warning mt-3">
                    <i className="fa fa-sign-in mr-2"></i>
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><Link to="/">Trang chủ</Link></li>
                            <li className="active">Danh sách yêu thích</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="wishlist-area pt-60 pb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {favorites.length === 0 ? (
                                <div className="empty-wishlist text-center py-5">
                                    <i className="fa fa-heart-o" style={{ fontSize: '80px', color: '#fed700' }}></i>
                                    <h3 className="mt-4">Danh sách yêu thích trống</h3>
                                    <p className="text-muted">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
                                    <Link to="/shop" className="btn btn-warning mt-3">
                                        <i className="fa fa-shopping-bag mr-2"></i>
                                        Mua sắm ngay
                                    </Link>
                                </div>
                            ) : (
                                <div className="table-content table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="li-product-remove">Xóa</th>
                                                <th className="li-product-thumbnail">Hình ảnh</th>
                                                <th className="cart-product-name">Sản phẩm</th>
                                                <th className="li-product-price">Giá</th>
                                                <th className="li-product-stock-status">Tình trạng</th>
                                                <th className="li-product-add-cart">Thêm vào giỏ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {favorites.map((favorite) => {
                                                const product = favorite.id_product;
                                                if (!product) return null;

                                                const salePrice = getSalePrice(product);
                                                const stockStatus = getStockStatus(product.number);
                                                
                                                return (
                                                    <tr key={favorite._id}>
                                                        <td className="li-product-remove">
                                                            <button 
                                                                onClick={() => handleRemove(favorite._id)}
                                                                className="btn btn-link text-danger"
                                                                title="Xóa khỏi danh sách yêu thích"
                                                            >
                                                                <i className="fa fa-times"></i>
                                                            </button>
                                                        </td>
                                                        <td className="li-product-thumbnail">
                                                            <Link to={`/detail/${product._id}`}>
                                                                <img 
                                                                    src={product.image || '/assets/images/no-image.png'} 
                                                                    alt={product.name_product}
                                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                                />
                                                            </Link>
                                                        </td>
                                                        <td className="li-product-name">
                                                            <Link to={`/detail/${product._id}`}>
                                                                {product.name_product}
                                                            </Link>
                                                        </td>
                                                        <td className="li-product-price">
                                                            {product.id_sale && product.id_sale.sale > 0 ? (
                                                                <div>
                                                                    <span className="amount">{formatPrice(salePrice)}</span>
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        <del>{formatPrice(product.price_product)}</del>
                                                                    </small>
                                                                    <br />
                                                                    <span className="badge badge-danger">
                                                                        -{product.id_sale.sale}%
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="amount">{formatPrice(product.price_product)}</span>
                                                            )}
                                                        </td>
                                                        <td className="li-product-stock-status">
                                                            <span className={stockStatus.className}>
                                                                {stockStatus.text}
                                                            </span>
                                                        </td>
                                                        <td className="li-product-add-cart">
                                                            <button
                                                                onClick={() => handleAddToCart(product)}
                                                                disabled={product.number === 0}
                                                                className={`btn ${product.number === 0 ? 'btn-secondary' : 'btn-warning'}`}
                                                            >
                                                                <i className="fa fa-shopping-cart mr-2"></i>
                                                                Thêm vào giỏ
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    
                                    <div className="mt-4 text-right">
                                        <p className="text-muted">
                                            Tổng số sản phẩm yêu thích: <strong>{favorites.length}</strong>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Favorite;