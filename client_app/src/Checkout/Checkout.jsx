import React, { useEffect, useState } from 'react';
import io from "socket.io-client";

import './Checkout.css'
import OrderAPI from '../API/OrderAPI';
import Paypal from './Paypal';
import { useForm } from "react-hook-form";
import { Redirect } from 'react-router-dom';
import { changeCount } from '../Redux/Action/ActionCount';
import { useDispatch, useSelector } from 'react-redux';
import NoteAPI from '../API/NoteAPI';
import Detail_OrderAPI from '../API/Detail_OrderAPI';
import CouponAPI from '../API/CouponAPI';
import MoMo from './MoMo.jsx';
import MapComponent from './MapComponent';
import StripePayment from './StripePayment';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const socket = io(API_URL, {
    transports: ['websocket'], jsonp: false
});
socket.connect();

Checkout.propTypes = {

};


function Checkout(props) {

    const [orderID, setOrderID] = useState('')

    const [carts, set_carts] = useState([])

    const [total_price, set_total_price] = useState(0)

    const [discount, set_discount] = useState(0)

    // state load_map
    const [load_map, set_load_map] = useState(true)

    // state load_order
    const [load_order_status, set_load_order_status] = useState(false)

    const [check_action, set_check_action] = useState(false)


    useEffect(() => {

        if (check_action) {

            set_carts(JSON.parse(localStorage.getItem('carts')))

            Sum_Price(JSON.parse(localStorage.getItem('carts')), 0)

            set_check_action(false)
        }

    }, [check_action])

    // Hàm này dùng để tính tổng tiền
    function Sum_Price(carts, sum_price) {

        carts.map(value => {
            return sum_price += Number(value.count) * Number(value.price_product)
        })

        const total = Number(sum_price)
        
        // Lấy giá ship từ localStorage hoặc state, nếu không có thì = 0
        const shippingPrice = Number(price) || Number(localStorage.getItem('price')) || 0

        if (localStorage.getItem('coupon')){
            // GET localStorage
            const coupon = JSON.parse(localStorage.getItem('coupon'))

            // Chuyển promotion từ string sang number - hỗ trợ nhiều format
            let promotionPercent = 0
            const promotionStr = coupon.promotion.toString()
            
            // Tìm số trong string (hỗ trợ "50%", "Giảm 20%", "20", v.v.)
            const numberMatch = promotionStr.match(/\d+(\.\d+)?/)
            if (numberMatch) {
                promotionPercent = parseFloat(numberMatch[0])
            }

            const discountAmount = (total * promotionPercent) / 100

            set_discount(discountAmount)

            const newTotal = total - discountAmount + shippingPrice

            localStorage.setItem("total_price", newTotal)

            set_total_price(newTotal)
        }else{
            
            const newTotal = total + shippingPrice
            localStorage.setItem("total_price", newTotal)

            set_total_price(newTotal)

        }

    }

    const [show_error, set_show_error] = useState(false)

    const [information, set_information] = useState({
        fullname: '',
        phone: '',
        address: '',
        email: ''
    })

    const onChangeFullname = (e) => {
        set_information({
            fullname: e.target.value,
            phone: information.phone,
            address: information.address,
            email: information.email
        })
    }
    const onChangePhone = (e) => {
        set_information({
            fullname: information.fullname,
            phone: e.target.value,
            address: information.address,
            email: information.email
        })
    }

    const onChangeAddress = (e) => {
        set_information({
            fullname: information.fullname,
            phone: information.phone,
            address: e.target.value,
            email: information.email
        })
    }
    const onChangeEmail = (e) => {
        set_information({
            fullname: information.fullname,
            phone: information.phone,
            address: information.address,
            email: e.target.value
        })
    }

    // Hàm này dùng để check validation cho paypal
    useEffect(() => {

        checkValidation()

    }, [information])

    // Kiểm tra Paypal
    function checkValidation() {
        if (information.fullname === '') {
            set_show_error(true)
        } else {
            if (information.phone === '') {
                set_show_error(true)
            } else {
                if (information.email === '') {
                    
                    localStorage.setItem('information', JSON.stringify(information))

                    set_show_error(true)
                } else {
                    set_show_error(false)
                }
            }
        }
    }


    const { register, handleSubmit, errors } = useForm();

    const [redirect, set_redirect] = useState(false)


    const [load_order, set_load_order] = useState(false)

    const count_change = useSelector(state => state.Count.isLoad)

    const dispatch = useDispatch()

    // Hàm này dùng để thanh toán offline
    const handler_Checkout = async (data) => {

        set_load_order(true)

        if (localStorage.getItem("id_coupon")){

            const responseUpdate = await CouponAPI.updateCoupon(localStorage.getItem("id_coupon"))
            console.log(responseUpdate)

        }

        // data Delivery
        const data_delivery = {
            // id_delivery:  Math.random.toString(),
            fullname: information.fullname,
            phone: information.phone,
        }

        // Xứ lý API Delivery
        const response_delivery = await NoteAPI.post_note(data_delivery)

        // data Order
        const data_order = {
            id_user: sessionStorage.getItem('id_user'),
            address: information.address,
            total: total_price,
            status: "1",
            pay: false,
            id_payment: '6086709cdc52ab1ae999e882',
            id_note: response_delivery._id,
            feeship: price,
            id_coupon: localStorage.getItem('id_coupon') ? localStorage.getItem('id_coupon') : '',
            create_time: `${new Date().getDate()}/${parseInt(new Date().getMonth()) + 1}/${new Date().getFullYear()}`
        }

        // Xứ lý API Order
        const response_order = await OrderAPI.post_order(data_order)

        // data carts
        const data_carts = JSON.parse(localStorage.getItem('carts'))

        // Xử lý API Detail_Order
        for (let i = 0; i < data_carts.length; i++) {

            const data_detail_order = {
                id_order: response_order._id,
                id_product: data_carts[i].id_product,
                name_product: data_carts[i].name_product,
                price_product: data_carts[i].price_product,
                count: data_carts[i].count,
                size: data_carts[i].size
            }

            await Detail_OrderAPI.post_detail_order(data_detail_order)

        }

        // data email
        const data_email = {
            id_order: response_order._id,
            total: total_price,
            fullname: information.fullname,
            phone: information.phone,
            price: price,
            address: information.address,
            email: information.email
        }

        // Gửi socket lên server
        socket.emit('send_order', "Có người vừa đặt hàng")
        // Xử lý API Send Mail

        const send_mail = await OrderAPI.post_email(data_email)
        console.log(send_mail)

        localStorage.removeItem('information')
        localStorage.removeItem('total_price')
        localStorage.removeItem('price')
        localStorage.removeItem('id_coupon')
        localStorage.removeItem('coupon')
        localStorage.setItem('carts', JSON.stringify([]))

        set_redirect(true)


        // Hàm này dùng để load lại phần header bằng Redux
        const action_count_change = changeCount(count_change)
        dispatch(action_count_change)

    }

    const Change_Load_Order = (value) => {

        set_load_order(value)

    }


    //--------------- Xử lý Google API ------------------//

    const [error_address, set_error_address] = useState(false)

    const [from, set_from] = useState('273 An Duong Vuong, Phuong 3, Quan 5, Ho Chi Minh City, Vietnam')

    // Khoảng cách
    const [distance, set_distance] = useState('')

    // Thời gian đi trong bn phút
    const [duration, set_duration] = useState('')

    // Giá tiền
    const [price, set_price] = useState('')


    // Kiểm tra xem khách hàng đã nhập chỉ nhận hàng hay chưa
    const handler_Next = () => {

        if (!information.address) {
            set_error_address(true)
            return
        }

        // Sau khi mà đổ dữ liệu ở bên Jquery xong
        // thì qua bên này mình sẽ lấy những giá trị vừa xử lý

        const kilo = document.getElementById('in_kilo').innerHTML
        const duration_text = document.getElementById('duration_text').innerHTML
        const price_shipping = document.getElementById('price_shipping').innerHTML
        const to_places = document.getElementById('to_places').value

        console.log(kilo)
        console.log(duration_text)
        console.log(price_shipping)

        set_distance(kilo)
        set_duration(duration_text)

        localStorage.setItem('price', price_shipping)
        set_price(price_shipping)

        set_information({
            fullname: information.fullname,
            phone: information.phone,
            address: to_places,
            email: information.email
        })
        if (kilo) {
            set_load_map(false)
            set_load_order_status(true) // Hiển thị phần checkout
            set_check_action(true)

        }

    }

    const [momoImageError, setMomoImageError] = useState(false)

    const handlerMomo = () => {

        setOrderID(Math.random().toString())
        console.log("Momo Thanh Cong")

    }

    return (
        <div>

            {
                load_order && (
                    <div className="wrapper_loader">
                        <div className="loader"></div>
                    </div>
                )
            }

            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li className="active">Checkout</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                {
                    load_map && (
                        <div className="row">
                            <div className="col-lg-6 col-12 pb-5">
                                <div className="checkbox-form">
                                    <h3>Check Distance</h3>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label>From <span className="required">*</span></label>
                                                <input type="text" name="from"
                                                    id="from_places"
                                                    disabled="true"
                                                    value={from} />
                                                <input id="origin" name="origin" required="" type="hidden"
                                                    value={from} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label>To <span className="required">*</span></label>
                                                <input type="text"
                                                    id="to_places"
                                                    placeholder="Ví dụ: 268 Lý Thường Kiệt, Q.10, TP.HCM hoặc Đại học Sài Gòn"
                                                    value={information.address}
                                                    onChange={onChangeAddress} />
                                                {error_address && <span style={{ color: 'red' }}>* Address is required</span>}
                                                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                                                    💡 Nhập địa chỉ đầy đủ: Số nhà, Đường, Phường/Xã, Quận/Huyện, TP.HCM
                                                </small>
                                                <input id="destination" type="hidden" name="destination" />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <div className="form-group">
                                                    <label>
                                                        Travel Mode
                                                        </label>
                                                    <select id="travel_mode" name="travel_mode">
                                                        <option value="DRIVING">
                                                            DRIVING
                                                            </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div id="result" className="hide">
                                                <div>
                                                    <label htmlFor="Kilometers">Kilometers: </label>&nbsp;
                                                        <label id="in_kilo"></label>
                                                </div>
                                                <div>
                                                    <label htmlFor="Duration">Duration: </label>&nbsp;
                                                        <label id="duration_text"></label>
                                                </div>
                                                <div>
                                                    <label htmlFor="Price">Shipping Cost: </label>&nbsp;
                                                        <label id="price_shipping"></label>
                                                        &nbsp;<label>VNĐ</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="order-button-payment">
                                                <input value="CHECKING" type="submit" id="distance_form" onClick={(e) => {
                                                    e.preventDefault();
                                                    if (window.calculateLeafletDistance) {
                                                        window.calculateLeafletDistance();
                                                    }
                                                }} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="d-flex justify-content-end">
                                                <div className="order-button-payment">
                                                    <input value="Next" onClick={handler_Next} id="distance_next" type="submit" style={{ padding: '.4rem 1.6rem' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-12">
                                <MapComponent 
                                    fromAddress={from}
                                    toAddress={information.address}
                                />
                            </div>
                        </div>
                    )
                }
                {
                    load_order_status && (
                        <div className="row">
                            <div className="col-lg-6 col-12 pb-5">
                                <form onSubmit={handleSubmit(handler_Checkout)}>
                                    <div className="checkbox-form">
                                        <h3>Billing Details</h3>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>Full Name <span className="required">*</span></label>
                                                    <input placeholder="Enter Fullname" type="text" name="fullname"
                                                        ref={register({ required: true })}
                                                        value={information.fullname}
                                                        onChange={onChangeFullname} />
                                                    {errors.fullname && errors.fullname.type === "required" && <span style={{ color: 'red' }}>* Fullname is required</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>Phone Number <span className="required">*</span></label>
                                                    <input placeholder="Enter Phone Number" type="text" name="phone"
                                                        ref={register({ required: true })}
                                                        value={information.phone}
                                                        onChange={onChangePhone} />
                                                    {errors.phone && errors.phone.type === "required" && <span style={{ color: 'red' }}>* Phone Number is required</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>Address <span className="required">*</span></label>
                                                    <input placeholder="Street address" type="text" name="address"
                                                        ref={register({ required: true })}
                                                        value={information.address}
                                                        onChange={onChangeAddress}
                                                        disabled="true" />
                                                    {errors.address && errors.address.type === "required" && <span style={{ color: 'red' }}>* Address is required</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>Email <span className="required">*</span></label>
                                                    <input placeholder="Enter Email" type="email" name="email"
                                                        ref={register({ required: true })}
                                                        value={information.email}
                                                        onChange={onChangeEmail} />
                                                    {errors.email && errors.email.type === "required" && <span style={{ color: 'red' }}>* Email is required</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="order-button-payment">
                                                    {
                                                        redirect && <Redirect to="/success" />
                                                    }
                                                    <input value="Place order" type="submit" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-lg-6 col-12">
                                <div className="your-order">
                                    <h3>Your order</h3>
                                    <div className="your-order-table table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="cart-product-name">Product</th>
                                                    <th className="cart-product-total">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    carts && carts.map(value => (
                                                        <tr className="cart_item" key={value._id}>
                                                            <td className="cart-product-name">{value.name_product}<strong className="product-quantity"> × {value.count}</strong></td>
                                                            <td className="cart-product-total"><span className="amount">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(parseInt(value.price_product) * parseInt(value.count)) + ' VNĐ'}</span></td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                            <tfoot>
                                                <tr className="cart-subtotal">
                                                    <th>Shipping Cost</th>
                                                    <td><span className="amount">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(price) + ' VNĐ'}</span></td>
                                                </tr>
                                                <tr className="cart-subtotal">
                                                    <th>Discount</th>
                                                    <td><span className="amount">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(discount) + ' VNĐ'}</span></td>
                                                </tr>
                                                <tr className="order-total">
                                                    <th>Order Total</th>
                                                    <td><strong><span className="amount">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(total_price) + ' VNĐ'}</span></strong></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="payment-method">
                                        <div className="payment-accordion">
                                            <div id="accordion">
                                                <div className="card">
                                                    <div className="card-header" id="#payment-3">
                                                        <h5 className="panel-title">
                                                            <a className="collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                                PayPal
                                                </a>
                                                        </h5>
                                                    </div>
                                                    <div id="collapseThree" className="collapse">
                                                        <div className="card-body">
                                                            {
                                                                show_error ? 'Please Checking Information!' :
                                                                    <Paypal
                                                                        information={information}
                                                                        total={total_price}
                                                                        Change_Load_Order={Change_Load_Order}
                                                                        from={from}
                                                                        distance={distance}
                                                                        duration={duration}
                                                                        price={price}
                                                                    />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="card">
                                                    <div className="card-header" id="#payment-3">
                                                        <h5 className="panel-title">
                                                            <a className="collapsed" data-toggle="collapse" data-target="#collapseMomo" aria-expanded="false" aria-controls="collapseMomo">
                                                                MoMo
                                                        </a>
                                                        </h5>
                                                    </div>
                                                    <div id="collapseMomo" className="collapse">
                                                        <div className="card-body">
                                                           {
  show_error ? 'Please Checking Information!' :
  <div
    style={{
      display: 'flex',
      width: '100%',
      minHeight: '260px',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        flexDirection: 'column',
      }}
    >
      {/* Logo MoMo với fallback, LOGO TO và Ở GIỮA */}
      {!momoImageError ? (
        <img
          src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
          alt="MoMo Logo"
          width="160"
          height="160"
          onClick={handlerMomo}
          onError={() => setMomoImageError(true)}
          style={{
            cursor: 'pointer',
            border: '3px solid #a50064',
            borderRadius: '16px',
            padding: '10px',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      ) : (
        /* Fallback button nếu ảnh lỗi — cũng ở giữa và to */
        <div
          onClick={handlerMomo}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px 24px',
            border: '3px solid #a50064',
            borderRadius: '12px',
            backgroundColor: '#a50064',
            color: 'white',
            fontWeight: 'bold',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease',
            minWidth: '240px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#8a0052';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#a50064';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              backgroundColor: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontWeight: 'bold',
              color: '#a50064',
            }}
          >
            M
          </div>
          <span style={{ fontSize: '16px' }}>Thanh toán với MoMo</span>
        </div>
      )}

      {/* Component MoMo */}
      <MoMo orderID={orderID} total={total_price} />
    </div>
  </div>
}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="card">
                                                    <div className="card-header" id="#payment-4">
                                                        <h5 className="panel-title">
                                                            <a className="collapsed" data-toggle="collapse" data-target="#collapseStripe" aria-expanded="false" aria-controls="collapseStripe">
                                                                Stripe (Credit/Debit Card)
                                                        </a>
                                                        </h5>
                                                    </div>
                                                    <div id="collapseStripe" className="collapse">
                                                        <div className="card-body">
                                                            {
                                                                show_error ? 'Please Checking Information!' :
                                                                <StripePayment
                                                                    information={information}
                                                                    total={total_price}
                                                                    Change_Load_Order={Change_Load_Order}
                                                                    from={from}
                                                                    distance={distance}
                                                                    duration={duration}
                                                                    price={price}
                                                                />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>

    );
}

export default Checkout;