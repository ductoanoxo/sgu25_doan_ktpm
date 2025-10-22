import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SaleAPI from '../../API/SaleAPI';

Products.propTypes = {
    products: PropTypes.array,
    sort: PropTypes.string
};

Products.defaultProps = {
    products: [],
    sort: ''
}

function Products(props) {

    const { products, sort } = props
    const [salesData, setSalesData] = useState({})

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

    if (sort === 'DownToUp') {
        products.sort((a, b) => {
            return a.price_product - b.price_product
        });
    }
    else if (sort === 'UpToDown') {
        products.sort((a, b) => {
            return b.price_product - a.price_product
        });
    }

    return (
        <div className="row">
            {
                products && products.map(value => {
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
                                <div className="product-image">
                                    <Link to={`/detail/${value._id}`}>
                                        <img src={value.image} alt="Li's Product Image" />
                                    </Link>
                                    {sale ? (
                                        <span className="sticker">-{discountPercent}%</span>
                                    ) : (
                                        <span className="sticker">New</span>
                                    )}
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
            }
        </div>
    );
}

export default Products;