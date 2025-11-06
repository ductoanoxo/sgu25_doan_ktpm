import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import io from "socket.io-client";
import StripeAPI from '../API/StripeAPI';
import OrderAPI from '../API/OrderAPI';
import NoteAPI from '../API/NoteAPI';
import Detail_OrderAPI from '../API/Detail_OrderAPI';
import CouponAPI from '../API/CouponAPI';
import { useDispatch, useSelector } from 'react-redux';
import { changeCount } from '../Redux/Action/ActionCount';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:8000', {
    transports: ['websocket'], 
    jsonp: false
});
socket.connect();

// Khởi tạo Stripe với publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

StripePayment.propTypes = {
    information: PropTypes.object,
    total: PropTypes.number,
    Change_Load_Order: PropTypes.func,
    from: PropTypes.string,
    distance: PropTypes.string,
    duration: PropTypes.string,
    price: PropTypes.string,
};

StripePayment.defaultProps = {
    information: {},
    total: 0,
    Change_Load_Order: null,
    from: '',
    distance: '',
    duration: '',
    price: '',
}

// Card Element styles
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
};

// Component con để xử lý thanh toán
const CheckoutForm = ({ information, total, Change_Load_Order, price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [redirect, setRedirect] = useState(false);

  const count_change = useSelector(state => state.Count.isLoad);
  const dispatch = useDispatch();

  // Tạo Payment Intent khi component mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await StripeAPI.createPaymentIntent({
          amount: total,
          currency: 'vnd'
        });
        setClientSecret(response.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setPaymentError('Không thể khởi tạo thanh toán. Vui lòng thử lại.');
      }
    };

    if (total > 0) {
      createPaymentIntent();
    }
  }, [total]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    // Xác nhận thanh toán
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: information.fullname,
          email: information.email,
          phone: information.phone,
        },
      },
    });

    if (error) {
      setPaymentError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      setPaymentSuccess(true);
      
      // Set loading state như Paypal
      Change_Load_Order && Change_Load_Order(true);
      
      try {
        // Xử lý đặt hàng sau khi thanh toán thành công
        await processOrder(paymentIntent.id);
      } catch (orderError) {
        console.error('Error processing order:', orderError);
        setPaymentError('Thanh toán thành công nhưng có lỗi xử lý đơn hàng. Vui lòng liên hệ hỗ trợ.');
      }
      
      setIsProcessing(false);
    }
  };

  const processOrder = async (stripePaymentIntentId) => {
    try {
      // Update coupon if exists
      if (localStorage.getItem("id_coupon")) {
        await CouponAPI.updateCoupon(localStorage.getItem("id_coupon"));
      }

      // Create delivery note
      const data_note = {
        fullname: information.fullname,
        phone: information.phone,
      };
      
      // Xứ lý API Note
      const response_Note = await NoteAPI.post_note(data_note);

      // data Order - giống với Paypal
      const data_order = {
        id_user: sessionStorage.getItem('id_user'),
        address: information.address,
        total: total,
        status: '1',
        pay: true,
        id_payment: '68d7d04fea4d621044e4e675', // Sử dụng payment ID thực từ database
        id_note: response_Note._id,
        feeship: price,
        id_coupon: localStorage.getItem('id_coupon') ? localStorage.getItem('id_coupon') : '',
        stripe_payment_intent: stripePaymentIntentId, // Thêm để tracking Stripe
        create_time: `${new Date().getDate()}/${parseInt(new Date().getMonth()) + 1}/${new Date().getFullYear()}`
      };

      const response_order = await OrderAPI.post_order(data_order);

      // data carts
      const data_carts = JSON.parse(localStorage.getItem('carts'));

      // Xử lý API Detail_Order
      for (let i = 0; i < data_carts.length; i++) {
        const data_detail_order = {
          id_order: response_order._id,
          id_product: data_carts[i].id_product,
          name_product: data_carts[i].name_product,
          price_product: data_carts[i].price_product,
          count: data_carts[i].count,
          size: data_carts[i].size
        };

        await Detail_OrderAPI.post_detail_order(data_detail_order);
      }

      // data email
      const data_email = {
          id_order: response_order._id,
          total: total,
          fullname: information.fullname,
          phone: information.phone,
          price: price,
          address: information.address,
          email: information.email
      }

      // Xử lý API Send Mail
      const send_mail = await OrderAPI.post_email(data_email)
      console.log(send_mail)
      
      localStorage.removeItem('information');
      localStorage.removeItem('total_price');
      localStorage.removeItem('price');
      localStorage.removeItem('id_coupon');
      localStorage.removeItem('coupon');
      localStorage.setItem('carts', JSON.stringify([]));

      setRedirect(true);

      // Hàm này dùng để load lại phần header bằng Redux
      const action_count_change = changeCount(count_change);
      dispatch(action_count_change);
    } catch (error) {
      console.error('Error processing order:', error);
      throw error;
    }
  };

  if (redirect) {
    return <Redirect to="/success" />;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '16px',
        backgroundColor: '#f9f9f9'
      }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: 'bold',
          color: '#333'
        }}>
          Thông tin thẻ tín dụng:
        </label>
        <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ccc' }}>
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {paymentError && (
        <div style={{ 
          color: '#e74c3c', 
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#fdf2f2',
          border: '1px solid #e74c3c',
          borderRadius: '4px'
        }}>
          {paymentError}
        </div>
      )}

      {paymentSuccess && (
        <div style={{ 
          color: '#27ae60', 
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f2fdf2',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}>
          ✅ Thanh toán thành công! Đang xử lý đơn hàng...
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: isProcessing ? '#bdc3c7' : '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (!isProcessing) {
            e.target.style.backgroundColor = '#2980b9';
          }
        }}
        onMouseLeave={(e) => {
          if (!isProcessing) {
            e.target.style.backgroundColor = '#3498db';
          }
        }}
      >
        {isProcessing ? (
          <>
            <span>Đang xử lý... </span>
            <div style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </>
        ) : (
          `Thanh toán ${new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(total)} VNĐ`
        )}
      </button>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ 
        marginTop: '16px', 
        fontSize: '12px', 
        color: '#666', 
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        🔒 Thanh toán được bảo mật bởi Stripe<br/>
        Hỗ trợ tất cả các loại thẻ tín dụng và ghi nợ<br/>
        <br/>
        <strong>Test Card:</strong> 4242424242424242<br/>
        <strong>Expiry:</strong> Any future date (e.g., 12/26)<br/>
        <strong>CVC:</strong> Any 3 digits (e.g., 123)
      </div>
    </form>
  );
};

// Component chính của Stripe - giống cấu trúc Paypal
function StripePayment(props) {
  const { information, total, Change_Load_Order, from, distance, duration, price } = props;
  
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        information={information} 
        total={total}
        Change_Load_Order={Change_Load_Order}
        price={price}
      />
    </Elements>
  );
}

export default StripePayment;