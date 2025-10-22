require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const StripeController = {
    // Tạo Payment Intent
    createPaymentIntent: async (req, res) => {
        try {
            const { amount, currency = 'vnd' } = req.body;

            // Validate input
            if (!amount || amount < 1) {
                return res.status(400).json({
                    error: 'Invalid amount. Amount must be at least 1.'
                });
            }

            // Tạo Payment Intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount), // Stripe yêu cầu số nguyên
                currency: currency,
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                    integration_check: 'accept_a_payment'
                }
            });

            res.status(200).json({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            });

        } catch (error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({
                error: error.message
            });
        }
    },

    // Xác nhận thanh toán
    confirmPayment: async (req, res) => {
        try {
            const { paymentIntentId } = req.body;

            if (!paymentIntentId) {
                return res.status(400).json({
                    error: 'Payment Intent ID is required'
                });
            }

            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            res.status(200).json({
                status: paymentIntent.status,
                paymentIntent: paymentIntent
            });

        } catch (error) {
            console.error('Error confirming payment:', error);
            res.status(500).json({
                error: error.message
            });
        }
    },

    // Webhook để xử lý các sự kiện từ Stripe
    handleWebhook: async (req, res) => {
        try {
            const sig = req.headers['stripe-signature'];
            let event;

            try {
                event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
            } catch (err) {
                console.log('Webhook signature verification failed:', err.message);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

            // Xử lý các loại event
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    console.log('Payment succeeded:', paymentIntent.id);
                    // Xử lý logic khi thanh toán thành công
                    break;

                case 'payment_intent.payment_failed':
                    const failedPayment = event.data.object;
                    console.log('Payment failed:', failedPayment.id);
                    // Xử lý logic khi thanh toán thất bại
                    break;

                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            res.status(200).json({ received: true });

        } catch (error) {
            console.error('Webhook error:', error);
            res.status(500).json({
                error: error.message
            });
        }
    }
};

module.exports = StripeController;