import axiosClient from './axiosClient';

const StripeAPI = {
    // Tạo Payment Intent
    createPaymentIntent: (data) => {
        const url = '/api/stripe/create-payment-intent';
        return axiosClient.post(url, data);
    },

    // Xác nhận thanh toán
    confirmPayment: (data) => {
        const url = '/api/stripe/confirm-payment';
        return axiosClient.post(url, data);
    }
};

export default StripeAPI;