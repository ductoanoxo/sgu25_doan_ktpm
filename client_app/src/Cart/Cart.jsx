import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { changeCount } from '../Redux/Action/ActionCount';
import CartAPI from '../API/CartAPI';
import queryString from 'query-string';
import CartsLocal from '../Share/CartsLocal';
import CouponAPI from '../API/CouponAPI';
import './Cart.css'; // Import a dedicated CSS file for styling

// A reusable Notification component for displaying alerts
const Notification = ({ status, onClose }) => {
    if (!status) return null;

    const icons = {
        success: 'fa fa-check-circle',
        warning: 'fa fa-exclamation-triangle',
        error: 'fa fa-times-circle',
        info: 'fa fa-info-circle',
    };

    const titles = {
        success: 'Thành Công!',
        warning: 'Cảnh Báo!',
        error: 'Lỗi!',
        info: 'Thông Báo',
    };

    return (
        <div className={`notification-overlay ${status ? 'show' : ''}`}>
            <div className={`notification-card ${status.type}`}>
                <i className={`notification-icon ${icons[status.type]}`}></i>
                <div className="notification-content">
                    <h4>{status.title || titles[status.type]}</h4>
                    {status.message && <p>{status.message}</p>}
                </div>
                <button onClick={onClose} className="notification-close-btn">&times;</button>
            </div>
        </div>
    );
};


function Cart(props) {
    const dispatch = useDispatch();
    const history = useHistory();

    // Centralized state for notifications
    const [notification, setNotification] = useState(null);

    const [list_carts, set_list_carts] = useState([]);
    const [total_price, set_total_price] = useState(0);
    const [coupon, set_coupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [new_price, set_new_price] = useState(0);

    const count_change = useSelector(state => state.Count.isLoad);

    // --- Cart Management ---
    const Sum_Price = useCallback((carts) => {
        const sum = carts.reduce((acc, value) => acc + parseInt(value.count) * parseInt(value.price_product), 0);
        set_total_price(sum);
    }, []);

    useEffect(() => {
        const carts = JSON.parse(localStorage.getItem('carts')) || [];
        set_list_carts(carts);
        Sum_Price(carts);
    }, [count_change, Sum_Price]);

    const updateCartCount = (id_cart, current_count, delta) => {
        const newCount = parseInt(current_count) + delta;
        if (newCount < 1) return;
        CartsLocal.updateProduct({ id_cart, count: newCount });
        const action_change_count = changeCount(count_change);
        dispatch(action_change_count);
    };

    const handler_delete_carts = (id_cart) => {
        CartsLocal.deleteProduct(id_cart);
        const action_change_count = changeCount(count_change);
        dispatch(action_change_count);
    };

    // --- Checkout ---
    const handler_checkout = () => {
        if (sessionStorage.getItem('id_user')) {
            if (list_carts.length < 1) {
                setNotification({ type: 'error', title: 'Giỏ Hàng Rỗng!', message: 'Vui lòng thêm sản phẩm vào giỏ hàng.' });
            } else {
                history.push('/checkout');
            }
        } else {
            setNotification({ type: 'error', title: 'Vui Lòng Đăng Nhập!', message: 'Bạn cần đăng nhập để tiếp tục thanh toán.' });
        }
    };

    // --- Coupon Management ---
    const handlerCoupon = async (e) => {
        e.preventDefault();
        if (!coupon || coupon.trim() === '') {
            localStorage.removeItem('id_coupon');
            localStorage.removeItem('coupon');
            setDiscount(0);
            set_new_price(total_price);
            return;
        }

        if (!sessionStorage.getItem('id_user')) {
            setNotification({ type: 'error', title: 'Vui Lòng Đăng Nhập!', message: 'Bạn cần đăng nhập để áp dụng mã giảm giá.' });
            return;
        }

        const params = {
            id_user: sessionStorage.getItem('id_user'),
            code: coupon,
            total_amount: total_price,
        };
        const query = '?' + queryString.stringify(params);
        const response = await CouponAPI.checkCoupon(query);

        if (response.msg === 'Không tìm thấy') {
            setNotification({ type: 'error', title: 'Mã Không Hợp Lệ!', message: 'Vui lòng kiểm tra lại mã giảm giá.' });
        } else if (response.msg === 'Bạn đã sử dụng mã này rồi') {
            setNotification({ type: 'warning', title: 'Mã Đã Được Sử Dụng!', message: 'Mỗi mã giảm giá chỉ có thể sử dụng một lần.' });
        } else if (response.msg === 'Không đủ điều kiện') {
            setNotification({ type: 'warning', title: 'Không Đủ Điều Kiện!', message: response.errorMessage || response.describe });
        } else {
            localStorage.setItem('id_coupon', response.coupon._id);
            localStorage.setItem('coupon', JSON.stringify(response.coupon));
            const promotionPercent = parseFloat(response.coupon.promotion.match(/\d+(\.\d+)?/)[0]) || 0;
            const discountAmount = (total_price * promotionPercent) / 100;
            setDiscount(discountAmount);
            set_new_price(total_price - discountAmount);
            setNotification({ type: 'success', title: 'Áp Dụng Thành Công!' });
        }
    };

    // Recalculate discount if cart changes
    useEffect(() => {
        const storedCoupon = localStorage.getItem('coupon');
        if (storedCoupon) {
            try {
                const couponObj = JSON.parse(storedCoupon);
                const promotionPercent = parseFloat(couponObj.promotion.match(/\d+(\.\d+)?/)[0]) || 0;
                const discountAmount = (total_price * promotionPercent) / 100;
                setDiscount(discountAmount);
                set_new_price(total_price - discountAmount);
            } catch (err) {
                localStorage.removeItem('coupon');
                localStorage.removeItem('id_coupon');
                setDiscount(0);
                set_new_price(total_price);
            }
        } else {
            set_new_price(total_price);
        }
    }, [total_price]);
    
    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <div>
            <Notification status={notification} onClose={() => setNotification(null)} />

            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li className="active">Shopping Cart</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="Shopping-cart-area pt-60 pb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <form action="#">
                                <div className="table-content table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="li-product-remove">Remove</th>
                                                <th className="li-product-thumbnail">Images</th>
                                                <th className="cart-product-name">Product</th>
                                                <th className="li-product-price">Price</th>
                                                <th className="li-product-price">Size</th>
                                                <th className="li-product-quantity">Quantity</th>
                                                <th className="li-product-subtotal">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {list_carts.length > 0 ? list_carts.map((value) => (
                                                <tr key={value.id_cart}>
                                                    <td className="li-product-remove">
                                                        <button type="button" className="remove-btn" onClick={() => handler_delete_carts(value.id_cart)}>
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                    </td>
                                                    <td className="li-product-thumbnail">
                                                        <Link to={`/detail/${value.id_product}`} title={`Xem chi tiết ${value.name_product}`}>
                                                            <img src={value.image} alt={value.name_product} className="cart-product-image" />
                                                            <span className="view-overlay"><i className="fa fa-search"></i></span>
                                                        </Link>
                                                    </td>
                                                    <td className="li-product-name">
                                                        <Link to={`/detail/${value.id_product}`} title={`Xem chi tiết ${value.name_product}`}>{value.name_product}</Link>
                                                    </td>
                                                    <td className="li-product-price"><span className="amount">{new Intl.NumberFormat('vi-VN').format(value.price_product)} VNĐ</span></td>
                                                    <td className="li-product-price"><span className="amount">{value.size}</span></td>
                                                    <td className="quantity">
                                                        <label>Quantity</label>
                                                        <div className="cart-plus-minus">
                                                            <input className="cart-plus-minus-box" value={value.count} type="text" readOnly />
                                                            <div className="dec qtybutton" onClick={() => updateCartCount(value.id_cart, value.count, -1)}><i className="fa fa-angle-down"></i></div>
                                                            <div className="inc qtybutton" onClick={() => updateCartCount(value.id_cart, value.count, 1)}><i className="fa fa-angle-up"></i></div>
                                                        </div>
                                                    </td>
                                                    <td className="product-subtotal"><span className="amount">{new Intl.NumberFormat('vi-VN').format(parseInt(value.price_product) * parseInt(value.count))} VNĐ</span></td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center pt-5 pb-5">
                                                        <h4>Giỏ hàng của bạn đang trống.</h4>
                                                        <Link to="/shop" className="btn btn-primary mt-3">Tiếp tục mua sắm</Link>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {list_carts.length > 0 && (
                                    <>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="coupon-all">
                                                    <div className="coupon">
                                                        <input id="coupon_code" className="input-text" onChange={(e) => set_coupon(e.target.value)} value={coupon} placeholder="Mã giảm giá" type="text" />
                                                        <input className="button" value="Áp dụng" type="submit" onClick={handlerCoupon} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-5 ml-auto">
                                                <div className="cart-page-total">
                                                    <h2>Tổng cộng giỏ hàng</h2>
                                                    <ul>
                                                        <li>Tạm tính <span>{new Intl.NumberFormat('vi-VN').format(total_price)} VNĐ</span></li>
                                                        <li>Giảm giá <span>- {new Intl.NumberFormat('vi-VN').format(discount)} VNĐ</span></li>
                                                        <li>Tổng cộng <span>{new Intl.NumberFormat('vi-VN').format(new_price)} VNĐ</span></li>
                                                    </ul>
                                                    <button type="button" className="proceed-checkout-btn" onClick={handler_checkout}>Tiến hành thanh toán</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;