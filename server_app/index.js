require('dotenv').config();
const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);

const cors = require("cors");

// Khởi tạo paypal
var paypal = require('paypal-rest-sdk');

// const io = require('socket.io')(http);

var upload = require('express-fileupload');
const port = 8000

const ProductAPI = require('./API/Router/product.router')
const UserAPI = require('./API/Router/user.router')
const OrderAPI = require('./API/Router/order.router')
const Detail_OrderAPI = require('./API/Router/detail_order.router')
const CommentAPI = require('./API/Router/comment.router')
const CategoryAPI = require('./API/Router/category.router')
const NoteAPI = require('./API/Router/note.router')

const ProductAdmin = require('./API/Router/admin/product.router')
const CategoryAdmin = require('./API/Router/admin/category.router')
const PermissionRouter = require('./API/Router/admin/permission.router')
const UserAdmin = require('./API/Router/admin/user.router')
const Order = require('./API/Router/admin/order.router')
const Coupon = require('./API/Router/admin/coupon.router')
const Sale = require('./API/Router/admin/sale.router')

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Users = require('./Models/user');
const Permission = require('./Models/permission'); // chỉ require 1 lần

const USER = "toantra349";
const PASS = encodeURIComponent("toantoan123");
const DB = "mydb";
const HOST = "ktpm.dwb8wtz.mongodb.net";

const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/${DB}?retryWrites=true&w=majority`;


mongoose.connect(uri)
    .then(async() => {
        console.log("✅ Kết nối MongoDB Atlas");

        // ===== Permission =====
        let adminPerm = await Permission.findOne({ permission: 'Admin' });
        if (!adminPerm) {
            adminPerm = new Permission({ permission: 'Admin' });
            await adminPerm.save();
            console.log("🌱 Permission 'Admin' đã được tạo");
        }

        let staffPerm = await Permission.findOne({ permission: 'Nhân Viên' });
        if (!staffPerm) {
            staffPerm = new Permission({ permission: 'Nhân Viên' });
            await staffPerm.save();
            console.log("🌱 Permission 'Nhân Viên' đã được tạo");
        }

        // ===== User (admin) =====
        let admin = await Users.findOne({ username: "admin" });
        if (!admin) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash("123456", salt);

            admin = new Users({
                username: "admin",
                password: hashedPassword,
                fullname: "Administrator",
                gender: "Nam",
                email: "admin@example.com",
                phone: "0123456789",
                id_permission: adminPerm._id
            });
            await admin.save();
            console.log("🌱 Admin đã được tạo với mật khẩu hash");
        } else {
            console.log("ℹ️ Admin đã tồn tại");
        }

        // ===== Category =====
        const Category = require('./Models/category');
        let category = await Category.findOne({ category: 'Áo' });
        if (!category) {
            category = new Category({ category: 'Áo' });
            await category.save();
            console.log("🌱 Category 'Áo' đã được tạo");
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
            console.log("🌱 Product 'Áo Thun Trắng' đã được tạo");
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
            console.log("🌱 Cart mẫu đã được tạo");
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
            console.log("🌱 Comment mẫu đã được tạo");
        }

        // ===== Coupon =====
        const Coupon = require('./Models/coupon');
        let coupon = await Coupon.findOne({ code: 'SALE20' });
        if (!coupon) {
            coupon = new Coupon({
                code: 'SALE20',
                count: 50,
                promotion: 'Giảm 20%',
                describe: 'Áp dụng cho đơn hàng từ 300k'
            });
            await coupon.save();
            console.log("🌱 Coupon mẫu đã được tạo");
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
            console.log("🌱 Delivery mẫu đã được tạo");
        }

        // ===== Payment =====
        const Payment = require('./Models/payment');
        let payment = await Payment.findOne({ pay_name: 'Thanh toán khi nhận hàng' });
        if (!payment) {
            payment = new Payment({ pay_name: 'Thanh toán khi nhận hàng' });
            await payment.save();
            console.log("🌱 Payment mẫu đã được tạo");
        }

        // Create Stripe payment method
        let stripePayment = await Payment.findOne({ pay_name: 'Stripe Payment' });
        if (!stripePayment) {
            stripePayment = new Payment({ pay_name: 'Stripe Payment' });
            await stripePayment.save();
            console.log("🌱 Stripe Payment method đã được tạo");
        }

        // ===== Note =====
        const Note = require('./Models/note');
        let note = await Note.findOne({ fullname: 'Nguyễn Văn A' });
        if (!note) {
            note = new Note({ fullname: 'Nguyễn Văn A', phone: '0909123456' });
            await note.save();
            console.log("🌱 Note mẫu đã được tạo");
        }

        // ===== Order =====
        const Order = require('./Models/order');
        let order = await Order.findOne({ id_user: admin._id });
        if (!order) {
            order = new Order({
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
            console.log("🌱 Order mẫu đã được tạo");
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
            console.log("🌱 Detail_Order mẫu đã được tạo");
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
            console.log("🌱 Favorite mẫu đã được tạo");
        }

        // ===== Sale =====
        const Sale = require('./Models/sale');
        let sale = await Sale.findOne({ id_product: product._id });
        if (!sale) {
            sale = new Sale({
                promotion: 10,
                describe: 'Giảm 10% cho sản phẩm mới',
                status: true,
                start: new Date(),
                end: new Date(new Date().setDate(new Date().getDate() + 7)),
                id_product: product._id
            });
            await sale.save();
            console.log("🌱 Sale mẫu đã được tạo");
        }

        // 🌱 Đồng bộ user chưa có permission
        const allUsers = await Users.find();
        for (let user of allUsers) {
            if (!user.id_permission) {
                if (user.username === 'admin') {
                    user.id_permission = adminPerm._id;
                } else {
                    user.id_permission = staffPerm._id;
                }
                await user.save();
                console.log(`✅ Đã cập nhật permission cho user: ${user.username}`);
            }
        }

        console.log("✅ Hoàn tất seed toàn bộ dữ liệu mẫu");
    })
    .catch(err => console.error("❌ Lỗi:", err));





app.use('/', express.static('public'))
app.use(upload());

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// Cài đặt config cho paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AZs1BwWM6IlHg7FFjBOURgGUuObrQmEKguSVbowu4ZqOuH7n2em2NBDmzBoQOqrUsgV-CVAsylOOB5ve', // Thông số này copy bên my account paypal
    'client_secret': 'ELcS0dYevQhG7LZrBQ-fdOpPXINVQXfKQCzh8f7uFpM2vpO_g0hz5K4rk2tg1dO5p2Hzxvsx-m2fn0QU' // Thông số này cùng vậy
});

app.use('/api/Product', ProductAPI)
app.use('/api/User', UserAPI)
app.use('/api/Payment', OrderAPI)
app.use('/api/Comment', CommentAPI)
app.use('/api/Note', NoteAPI)
app.use('/api/DetailOrder', Detail_OrderAPI)
app.use('/api/Category', CategoryAPI)

app.use('/api/admin/Product', ProductAdmin)
app.use('/api/admin/Category', CategoryAdmin)
app.use('/api/admin/Permission', PermissionRouter);

app.use('/api/admin/User', UserAdmin)
app.use('/api/admin/Order', Order)
app.use('/api/admin/Coupon', Coupon)
app.use('/api/admin/Sale', Sale)

// Stripe API routes
const StripeAPI = require('./API/Router/stripe.router')
app.use('/api/stripe', StripeAPI)


io.on("connection", (socket) => {
    console.log(`Có người vừa kết nối, socketID: ${socket.id}`);


    socket.on('send_order', (data) => {
        console.log(data)

        socket.broadcast.emit("receive_order", data);
    })
})

http.listen(port, () => {
    console.log('listening on *: ' + port);
});