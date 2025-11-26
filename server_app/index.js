require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const cors = require('cors');

// Import Prometheus metrics
const { register, metrics } = require('./metrics');

// Khởi tạo paypal
var paypal = require('paypal-rest-sdk');

// const io = require('socket.io')(http);

var upload = require('express-fileupload');
const port = process.env.PORT || 8000;

const ProductAPI = require('./API/Router/product.router');
const UserAPI = require('./API/Router/user.router');
const OrderAPI = require('./API/Router/order.router');
const Detail_OrderAPI = require('./API/Router/detail_order.router');
const CommentAPI = require('./API/Router/comment.router');
const CategoryAPI = require('./API/Router/category.router');
const NoteAPI = require('./API/Router/note.router');
const FavoriteAPI = require('./API/Router/favorite.router');
const UploadAPI = require('./API/Router/upload.router');

const ProductAdmin = require('./API/Router/admin/product.router');
const CategoryAdmin = require('./API/Router/admin/category.router');
const PermissionRouter = require('./API/Router/admin/permission.router');
const UserAdmin = require('./API/Router/admin/user.router');
const Order = require('./API/Router/admin/order.router');
const Coupon = require('./API/Router/admin/coupon.router');
const Sale = require('./API/Router/admin/sale.router');

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Users = require('./Models/user');
const Permission = require('./Models/permission'); // chỉ require 1 lần

const USER = 'toantra349';
const PASS = encodeURIComponent('toantoan123');
const DB = 'mydb';
const HOST = 'ktpm.dwb8wtz.mongodb.net';

const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/${DB}?retryWrites=true&w=majority`;

console.log('🔌 Đang kết nối đến MongoDB Atlas...');

mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(async() => {
        console.log('✅ Kết nối MongoDB Atlas');
        
        try {

        // ===== Permission =====
        let adminPerm = await Permission.findOne({ permission: 'Admin' });
        if (!adminPerm) {
            adminPerm = new Permission({ 
                permission: 'Admin',
                description: 'Quản trị viên cao nhất có toàn quyền truy cập hệ thống',
                level: 100,
                isAdmin: true,
                isStaff: false,
                isCustomer: false,
                isSystem: true,
                permissions: {
                    products: { view: true, create: true, edit: true, delete: true },
                    categories: { view: true, create: true, edit: true, delete: true },
                    users: { view: true, create: true, edit: true, delete: true },
                    orders: { view: true, create: true, edit: true, delete: true },
                    coupons: { view: true, create: true, edit: true, delete: true },
                    sales: { view: true, create: true, edit: true, delete: true },
                    permissions: { view: true, create: true, edit: true, delete: true }
                }
            });
            await adminPerm.save();
            console.log('🌱 Permission \'Admin\' đã được tạo với đầy đủ quyền');
        } else if (!adminPerm.isSystem) {
            // Update existing admin permission to system
            adminPerm.isSystem = true;
            adminPerm.level = 100;
            adminPerm.isAdmin = true;
            adminPerm.description = adminPerm.description || 'Quản trị viên cao nhất có toàn quyền truy cập hệ thống';
            await adminPerm.save();
            console.log('✅ Cập nhật permission Admin thành system permission');
        }

        let staffPerm = await Permission.findOne({ permission: 'Nhân Viên' });
        if (!staffPerm) {
            staffPerm = new Permission({ 
                permission: 'Nhân Viên',
                description: 'Nhân viên quản lý có quyền hạn trung cấp',
                level: 50,
                isAdmin: false,
                isStaff: true,
                isCustomer: false,
                isSystem: true,
                permissions: {
                    products: { view: true, create: true, edit: true, delete: false },
                    categories: { view: true, create: false, edit: false, delete: false },
                    users: { view: true, create: false, edit: false, delete: false },
                    orders: { view: true, create: false, edit: true, delete: false },
                    coupons: { view: true, create: true, edit: true, delete: false },
                    sales: { view: true, create: false, edit: false, delete: false },
                    permissions: { view: true, create: false, edit: false, delete: false }
                }
            });
            await staffPerm.save();
            console.log('🌱 Permission \'Nhân Viên\' đã được tạo');
        } else if (!staffPerm.isSystem) {
            // Update existing staff permission to system
            staffPerm.isSystem = true;
            staffPerm.level = 50;
            staffPerm.isStaff = true;
            staffPerm.description = staffPerm.description || 'Nhân viên quản lý có quyền hạn trung cấp';
            await staffPerm.save();
            console.log('✅ Cập nhật permission Nhân Viên thành system permission');
        }

        // Create Customer permission if not exists
        let customerPerm = await Permission.findOne({ permission: 'Customer' });
        if (!customerPerm) {
            customerPerm = new Permission({ 
                permission: 'Customer',
                description: 'Khách hàng - người dùng thông thường của hệ thống',
                level: 10,
                isAdmin: false,
                isStaff: false,
                isCustomer: true,
                isSystem: true,
                permissions: {
                    products: { view: true, create: false, edit: false, delete: false },
                    categories: { view: true, create: false, edit: false, delete: false },
                    users: { view: false, create: false, edit: false, delete: false },
                    orders: { view: true, create: true, edit: false, delete: false },
                    coupons: { view: true, create: false, edit: false, delete: false },
                    sales: { view: true, create: false, edit: false, delete: false },
                    permissions: { view: false, create: false, edit: false, delete: false }
                }
            });
            await customerPerm.save();
            console.log('🌱 Permission \'Customer\' đã được tạo');
        } else if (!customerPerm.isSystem) {
            // Update existing customer permission to system
            customerPerm.isSystem = true;
            customerPerm.level = 10;
            customerPerm.isCustomer = true;
            customerPerm.description = customerPerm.description || 'Khách hàng - người dùng thông thường của hệ thống';
            await customerPerm.save();
            console.log('✅ Cập nhật permission Customer thành system permission');
        }

        // ===== User (admin) =====
        let admin = await Users.findOne({ username: 'admin' });
        if (!admin) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash('123456', salt);

            admin = new Users({
                username: 'admin',
                password: hashedPassword,
                fullname: 'Administrator',
                gender: 'Nam',
                email: 'admin@example.com',
                phone: '0123456789',
                id_permission: adminPerm._id
            });
            await admin.save();
            console.log('🌱 Admin đã được tạo với mật khẩu hash');
        } else {
            console.log('ℹ️ Admin đã tồn tại');
        }

        // ===== Category =====
        const Category = require('./Models/category');
        let category = await Category.findOne({ category: 'Áo' });
        if (!category) {
            category = new Category({ category: 'Áo' });
            await category.save();
            console.log('🌱 Category \'Áo\' đã được tạo');
        }

        // ===== Product =====
        const Products = require('./Models/product');
        let product = await Products.findOne({ name_product: 'Áo Thun Trắng' });
        if (!product) {
            product = new Products({
                id_category: category._id,
                name_product: 'Áo Thun Trắng',
                price_product: '199000',
                image: 'aothuntrang.jpg',
                describe: 'Áo thun cotton 100%',
                gender: 'Unisex'
            });
            await product.save();
            console.log('🌱 Product \'Áo Thun Trắng\' đã được tạo');
        }

        // ===== Cart =====
        const Carts = require('./Models/cart');
        let cart = await Carts.findOne({ id_user: admin._id, id_product: product._id });
        if (!cart) {
            cart = new Carts({
                id_user: admin._id,
                id_product: product._id,
                name_product: product.name_product,
                price_product: 199000,
                count: 2,
                image: product.image,
                size: 'M'
            });
            await cart.save();
            console.log('🌱 Cart mẫu đã được tạo');
        }

        // ===== Comment =====
        const Comment = require('./Models/comment');
        let comment = await Comment.findOne({ id_product: product._id, id_user: admin._id });
        if (!comment) {
            comment = new Comment({
                id_product: product._id,
                id_user: admin._id,
                content: 'Áo đẹp, chất liệu tốt!',
                star: 5
            });
            await comment.save();
            console.log('🌱 Comment mẫu đã được tạo');
        }

        // ===== Coupon =====
        const CouponModel = require('./Models/coupon');
        let coupon = await CouponModel.findOne({ code: 'SALE20' });
        if (!coupon) {
            coupon = new CouponModel({
                code: 'SALE20',
                count: 50,
                promotion: 'Giảm 20%',
                describe: 'Áp dụng cho đơn hàng từ 300k'
            });
            await coupon.save();
            console.log('🌱 Coupon mẫu đã được tạo');
        }

        // ===== Delivery =====
        const Delivery = require('./Models/delivery');
        let delivery = await Delivery.findOne({ id_delivery: 'GHN01' });
        if (!delivery) {
            delivery = new Delivery({
                id_delivery: 'GHN01',
                from: 'TP.HCM',
                to: 'Hà Nội',
                distance: '1700km',
                duration: '2 ngày',
                price: '50000'
            });
            await delivery.save();
            console.log('🌱 Delivery mẫu đã được tạo');
        }

        // ===== Payment =====
        const Payment = require('./Models/payment');
        let payment = await Payment.findOne({ pay_name: 'Thanh toán khi nhận hàng' });
        if (!payment) {
            payment = new Payment({ pay_name: 'Thanh toán khi nhận hàng' });
            await payment.save();
            console.log('🌱 Payment mẫu đã được tạo');
        }

        // Create Stripe payment method
        let stripePayment = await Payment.findOne({ pay_name: 'Stripe Payment' });
        if (!stripePayment) {
            stripePayment = new Payment({ pay_name: 'Stripe Payment' });
            await stripePayment.save();
            console.log('🌱 Stripe Payment method đã được tạo');
        }

        // ===== Note =====
        const Note = require('./Models/note');
        let note = await Note.findOne({ fullname: 'Nguyễn Văn A' });
        if (!note) {
            note = new Note({ fullname: 'Nguyễn Văn A', phone: '0909123456' });
            await note.save();
            console.log('🌱 Note mẫu đã được tạo');
        }

        // ===== Order =====
        const OrderModel = require('./Models/order');
        let order = await OrderModel.findOne({ id_user: admin._id });
        if (!order) {
            order = new OrderModel({
                id_user: admin._id,
                id_payment: payment._id,
                id_note: note._id,
                address: '123 Nguyễn Trãi, Q.1, TP.HCM',
                total: 398000,
                status: 'Đang xử lý',
                pay: false,
                feeship: 50000,
                id_coupon: coupon._id,
                create_time: new Date().toISOString()
            });
            await order.save();
            console.log('🌱 Order mẫu đã được tạo');
        }

        // ===== Detail_Order =====
        const Detail_Order = require('./Models/detail_order');
        let detailOrder = await Detail_Order.findOne({ id_order: order._id, id_product: product._id });
        if (!detailOrder) {
            detailOrder = new Detail_Order({
                id_order: order._id,
                id_product: product._id,
                name_product: product.name_product,
                price_product: product.price_product,
                count: 2,
                size: 'M'
            });
            await detailOrder.save();
            console.log('🌱 Detail_Order mẫu đã được tạo');
        }

        // ===== Favorite =====
        const Favorite = require('./Models/favorite');
        let favorite = await Favorite.findOne({ id_user: admin._id, id_product: product._id });
        if (!favorite) {
            favorite = new Favorite({
                id_user: admin._id,
                id_product: product._id
            });
            await favorite.save();
            console.log('🌱 Favorite mẫu đã được tạo');
        }

        // ===== Sale =====
        const SaleModel = require('./Models/sale');
        let sale = await SaleModel.findOne({ id_product: product._id });
        if (!sale) {
            sale = new SaleModel({
                promotion: 10,
                describe: 'Giảm 10% cho sản phẩm mới',
                status: true,
                start: new Date(),
                end: new Date(new Date().setDate(new Date().getDate() + 7)),
                id_product: product._id
            });
            await sale.save();
            console.log('🌱 Sale mẫu đã được tạo');
        }

        // 🌱 Đồng bộ user chưa có permission - gán Customer cho user thường
        const allUsers = await Users.find();
        let updatedCount = 0;
        for (let user of allUsers) {
            if (!user.id_permission) {
                if (user.username === 'admin') {
                    user.id_permission = adminPerm._id;
                } else {
                    // Gán Customer cho tất cả user thường
                    user.id_permission = customerPerm._id;
                }
                await user.save();
                updatedCount++;
                console.log(`✅ Đã cập nhật permission cho user: ${user.username} → ${user.username === 'admin' ? 'Admin' : 'Customer'}`);
            }
        }
        
        if (updatedCount > 0) {
            console.log(`✅ Đã cập nhật permission cho ${updatedCount} users`);
        }

        console.log('✅ Hoàn tất seed toàn bộ dữ liệu mẫu');
        
        } catch (seedError) {
            console.error('❌ Lỗi khi seed dữ liệu:', seedError);
            // Server vẫn chạy nhưng log lỗi
        }
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối MongoDB:', err);
        process.exit(1); // Thoát nếu không kết nối được DB
    });

// MongoDB connection event handlers
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});




app.use('/', express.static('public'));
app.use(upload());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// Middleware to track request metrics
app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route ? req.route.path : req.path;
        
        // Track duration and total requests
        metrics.httpRequestDuration.labels(req.method, route, res.statusCode).observe(duration);
        metrics.httpRequestTotal.labels(req.method, route, res.statusCode).inc();
        
        // Track errors
        if (res.statusCode >= 400) {
            const errorType = res.statusCode >= 500 ? 'server_error' : 'client_error';
            metrics.httpErrorsTotal.labels(req.method, route, res.statusCode, errorType).inc();
        }
    });
    
    next();
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    try {
        // Update MongoDB connection status
        metrics.mongodbConnectionStatus.set(mongoose.connection.readyState === 1 ? 1 : 0);
        
        const metricsData = await register.metrics();
        res.send(metricsData);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Cài đặt config cho paypal
paypal.configure({
    'mode': process.env.PAYPAL_MODE || 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID || 'AZs1BwWM6IlHg7FFjBOURgGUuObrQmEKguSVbowu4ZqOuH7n2em2NBDmzBoQOqrUsgV-CVAsylOOB5ve',
    'client_secret': process.env.PAYPAL_CLIENT_SECRET || 'ELcS0dYevQhG7LZrBQ-fdOpPXINVQXfKQCzh8f7uFpM2vpO_g0hz5K4rk2tg1dO5p2Hzxvsx-m2fn0QU'
});

app.use('/api/Product', ProductAPI);
app.use('/api/User', UserAPI);
app.use('/api/Payment', OrderAPI);
app.use('/api/Comment', CommentAPI);
app.use('/api/Note', NoteAPI);
app.use('/api/DetailOrder', Detail_OrderAPI);
app.use('/api/Category', CategoryAPI);
app.use('/api/favorite', FavoriteAPI);
app.use('/api/upload', UploadAPI);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

app.use('/api/admin/Product', ProductAdmin);
app.use('/api/admin/Category', CategoryAdmin);
app.use('/api/admin/Permission', PermissionRouter);

app.use('/api/admin/User', UserAdmin);
app.use('/api/admin/Order', Order);
app.use('/api/admin/Coupon', Coupon);
app.use('/api/admin/Sale', Sale);

// Stripe API routes
const StripeAPI = require('./API/Router/stripe.router');
app.use('/api/stripe', StripeAPI);

// Global error handler - must be after all routes
app.use((err, req, res, next) => {
    console.error('❌ Global error handler caught:', err);
    
    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({ 
            msg: 'ID không hợp lệ',
            error: 'Invalid ObjectId format'
        });
    }
    
    // Handle other Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            msg: 'Dữ liệu không hợp lệ',
            error: err.message
        });
    }
    
    // Default error
    res.status(500).json({ 
        msg: 'Lỗi server',
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});


// Track socket connections with metrics
io.on('connection', (socket) => {
    metrics.activeConnections.inc();
    metrics.socketioEventsTotal.labels('connection', 'inbound').inc();
    console.log(`Có người vừa kết nối, socketID: ${socket.id}`);
    
    socket.on('disconnect', () => {
        metrics.activeConnections.dec();
        metrics.socketioEventsTotal.labels('disconnect', 'outbound').inc();
    });
    
    socket.on('send_order', (data) => {
        metrics.socketioEventsTotal.labels('send_order', 'inbound').inc();
        console.log(data);
        socket.broadcast.emit('receive_order', data);
    });
});

http.listen(port, '0.0.0.0', () => {
    console.log('listening on *: ' + port);
    console.log('📊 Prometheus metrics available at http://localhost:' + port + '/metrics');
    console.log('❤️  Health check available at http://localhost:' + port + '/health');
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully');
    http.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('✅ MongoDB connection closed');
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received, shutting down gracefully');
    http.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('✅ MongoDB connection closed');
            process.exit(0);
        });
    });
});