import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SaleAPI from '../../API/SaleAPI';
import FavoriteAPI from '../../API/FavoriteAPI';

Products.propTypes = {
    products: PropTypes.array,
    sort: PropTypes.string,
    priceRange: PropTypes.object,
    selectedSizes: PropTypes.array
};

Products.defaultProps = {
    products: [],
    sort: '',
    priceRange: { min: 0, max: 999999999 },
    selectedSizes: []
}

function Products(props) {

    const { products, sort, priceRange, selectedSizes } = props
    const [salesData, setSalesData] = useState({})
    const [favorites, setFavorites] = useState({}) // Track favorite status
    
    // Get user ID from Redux - try both sources
    const id_user_cart = useSelector(state => state.Cart.id_user)
    const id_user_session = useSelector(state => state.Session?.idUser)
    
    // Use whichever is available, or fall back to sessionStorage
    const id_user = id_user_cart || id_user_session || sessionStorage.getItem('id_user')

    // Lấy thông tin sale cho tất cả sản phẩm
    useEffect(() => {
        const fetchSales = async () => {
            const salesMap = {}
            for (const product of products) {
                try {
                    const response = await SaleAPI.checkSale(product._id)
                    if (response.msg === "Thanh Cong" && response.sale) {
                        salesMap[product._id] = response.sale
                    }
                } catch (error) {
                    console.error(`Error checking sale for product ${product._id}:`, error)
                }
            }
            setSalesData(salesMap)
        }

        if (products && products.length > 0) {
            fetchSales()
        }
    }, [products])

    // Lấy trạng thái favorite cho tất cả sản phẩm
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!id_user) return
            
            const favMap = {}
            for (const product of products) {
                try {
                    const response = await FavoriteAPI.checkFavorite(id_user, product._id)
                    favMap[product._id] = response.isFavorite
                } catch (error) {
                    console.error(`Error checking favorite for product ${product._id}:`, error)
                }
            }
            setFavorites(favMap)
        }

        if (id_user && products && products.length > 0) {
            fetchFavorites()
        }
    }, [id_user, products])

    // Hàm lấy giá sau khi sale
    const getSalePrice = (product) => {
        const sale = salesData[product._id]
        const basePrice = product.price_product
        
        if (sale && sale.promotion) {
            const discountPercent = Number(sale.promotion) || 0
            return Math.round(basePrice * (1 - discountPercent / 100))
        }
        
        return basePrice
    }

    // Toggle favorite
    const toggleFavorite = async (e, productId) => {
        e.preventDefault()
        e.stopPropagation()
        
        console.log('Toggle favorite - id_user:', id_user) // Debug log
        
        if (!id_user || id_user === '') {
            alert('Vui lòng đăng nhập để thêm vào danh sách yêu thích')
            return
        }

        try {
            const isFavorite = favorites[productId]
            
            if (isFavorite) {
                // Remove from favorites
                await FavoriteAPI.removeByProduct(id_user, productId)
                setFavorites(prev => ({ ...prev, [productId]: false }))
                alert('Đã xóa khỏi danh sách yêu thích')
            } else {
                // Add to favorites
                await FavoriteAPI.addToFavorite(id_user, productId)
                setFavorites(prev => ({ ...prev, [productId]: true }))
                alert('Đã thêm vào danh sách yêu thích')
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
            alert('Có lỗi xảy ra, vui lòng thử lại')
        }
    }

    // Sắp xếp sản phẩm
    let filteredProducts = [...products]
    
    // Filter theo price range
    filteredProducts = filteredProducts.filter(product => {
        const price = getSalePrice(product)
        return price >= priceRange.min && price <= priceRange.max
    })

    // Filter theo size
    if (selectedSizes.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            // Kiểm tra xem product có size không
            if (!product.size) return false
            
            // Tách chuỗi size thành mảng (VD: "S,M,L" -> ["S", "M", "L"])
            const productSizes = product.size.split(',').map(s => s.trim())
            
            // Kiểm tra xem có size nào match với selectedSizes không
            return selectedSizes.some(selectedSize => productSizes.includes(selectedSize))
        })
    }
    
    // Sort products
    if (sort === 'DownToUp') {
        filteredProducts.sort((a, b) => {
            const priceA = getSalePrice(a)
            const priceB = getSalePrice(b)
            return priceA - priceB
        })
    } else if (sort === 'UpToDown') {
        filteredProducts.sort((a, b) => {
            const priceA = getSalePrice(a)
            const priceB = getSalePrice(b)
            return priceB - priceA
        })
    }

    return (
        <div className="row">
            {filteredProducts.length === 0 ? (
                <div className="col-12 text-center py-5">
                    <h4>No products found matching your filters</h4>
                    <p>Try adjusting your filter criteria</p>
                </div>
            ) : (
                filteredProducts.map(value => {
                    const sale = salesData[value._id]
                    const basePrice = value.price_product
                    let salePrice = null
                    let discountPercent = 0

                    if (sale && sale.promotion) {
                        discountPercent = Number(sale.promotion) || 0
                        salePrice = Math.round(basePrice * (1 - discountPercent / 100))
                    }

                    return (
                        <div className="col-lg-4 col-md-4 col-sm-6 mt-40 animate__animated animate__zoomIn col_product" key={value._id}>
                            <div className="single-product-wrap">
                                <div className="product-image" style={{ position: 'relative' }}>
                                    <Link to={`/detail/${value._id}`}>
                                        <img src={value.image} alt="Li's Product Image" />
                                    </Link>
                                    {sale ? (
                                        <span className="sticker">-{discountPercent}%</span>
                                    ) : (
                                        <span className="sticker">New</span>
                                    )}
                                    {/* Wishlist Button - On image, bottom right */}
                                    <button 
                                        className="wishlist-btn"
                                        onClick={(e) => toggleFavorite(e, value._id)}
                                        title={favorites[value._id] ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                                        style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            right: '10px',
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            zIndex: 10,
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.1)'
                                            e.currentTarget.style.background = '#fed700'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)'
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'
                                        }}
                                    >
                                        <i 
                                            className={favorites[value._id] ? 'fa fa-heart' : 'fa fa-heart-o'}
                                            style={{ 
                                                color: favorites[value._id] ? '#dc3545' : '#666',
                                                fontSize: '18px'
                                            }}
                                        ></i>
                                    </button>
                                </div>
                                <div className="product_desc">
                                    <div className="product_desc_info">
                                        <div className="product-review">
                                            <h5 className="manufacturer">
                                                <a href="product-details.html">{value.name_product}</a>
                                            </h5>
                                            <div className="rating-box">
                                                <ul className="rating">
                                                    <li><i className="fa fa-star-o"></i></li>
                                                    <li><i className="fa fa-star-o"></i></li>
                                                    <li><i className="fa fa-star-o"></i></li>
                                                    <li className="no-star"><i className="fa fa-star-o"></i></li>
                                                    <li className="no-star"><i className="fa fa-star-o"></i></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h4><a className="product_name" href="single-product.html">Accusantium dolorem1</a></h4>
                                        <div className="price-box">
                                            {sale ? (
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <del className="new-price" style={{ color: '#999', fontSize: '14px' }}>
                                                        {new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(basePrice)+ ' VNĐ'}
                                                    </del>
                                                    <span className="new-price" style={{ color: 'red', fontWeight: 'bold' }}>
                                                        {new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(salePrice)+ ' VNĐ'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="new-price">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(basePrice)+ ' VNĐ'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    );
}

export default Products;