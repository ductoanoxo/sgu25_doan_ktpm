const express = require('express');
const router = express.Router();
const StripeController = require('../Controller/stripe.controller');

// Route để tạo Payment Intent
router.post('/create-payment-intent', StripeController.createPaymentIntent);

// Route để xác nhận thanh toán
router.post('/confirm-payment', StripeController.confirmPayment);

// Route webhook cho Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), StripeController.handleWebhook);

module.exports = router;