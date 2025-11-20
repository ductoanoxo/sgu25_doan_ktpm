# 📊 HƯỚNG DẪN SỬ DỤNG METRICS CHO CÁC ROUTER

## 🎯 Cách tích hợp Metrics Middleware vào Router

### 1. Import Middleware

```javascript
const {
    trackUserLogin,
    trackUserRegistration,
    trackOrderCreation,
    trackProductView,
    trackCartOperation,
    trackPayment,
    trackFileUpload
} = require('../middleware/metricsMiddleware');
```

### 2. Ví dụ tích hợp vào User Router

**File: `API/Router/user.router.js`**

```javascript
const express = require('express');
const router = express.Router();
const UserController = require('../Controller/user.controller');
const { trackUserLogin, trackUserRegistration } = require('../middleware/metricsMiddleware');

// Track user login
router.post('/signin', trackUserLogin(), UserController.signin);

// Track user registration
router.post('/signup', trackUserRegistration, UserController.signup);

module.exports = router;
```

### 3. Ví dụ tích hợp vào Product Router

**File: `API/Router/product.router.js`**

```javascript
const express = require('express');
const router = express.Router();
const ProductController = require('../Controller/product.controller');
const { trackProductView } = require('../middleware/metricsMiddleware');

// Track product views
router.get('/:id', trackProductView, ProductController.getProduct);
router.get('/detail/:id', trackProductView, ProductController.getProductDetail);

module.exports = router;
```

### 4. Ví dụ tích hợp vào Cart Router

**File: `API/Router/cart.router.js` (nếu có)**

```javascript
const express = require('express');
const router = express.Router();
const CartController = require('../Controller/cart.controller');
const { trackCartOperation } = require('../middleware/metricsMiddleware');

// Track cart operations
router.post('/add', trackCartOperation('add'), CartController.addToCart);
router.put('/update', trackCartOperation('update'), CartController.updateCart);
router.delete('/remove', trackCartOperation('remove'), CartController.removeFromCart);

module.exports = router;
```

### 5. Ví dụ tích hợp vào Order Router

**File: `API/Router/order.router.js`**

```javascript
const express = require('express');
const router = express.Router();
const OrderController = require('../Controller/order.controller');
const { trackOrderCreation } = require('../middleware/metricsMiddleware');

// Track order creation
router.post('/create', trackOrderCreation, OrderController.createOrder);

module.exports = router;
```

### 6. Ví dụ tích hợp vào Payment Router

**File: `API/Router/stripe.router.js` hoặc `API/Router/payment.router.js`**

```javascript
const express = require('express');
const router = express.Router();
const PaymentController = require('../Controller/payment.controller');
const { trackPayment } = require('../middleware/metricsMiddleware');

// Track Stripe payments
router.post('/create-payment-intent', trackPayment('stripe'), PaymentController.createPaymentIntent);

// Track PayPal payments
router.post('/paypal/create', trackPayment('paypal'), PaymentController.paypalCreate);

module.exports = router;
```

### 7. Ví dụ tích hợp vào Upload Router

**File: `API/Router/upload.router.js`**

```javascript
const express = require('express');
const router = express.Router();
const UploadController = require('../Controller/upload.controller');
const { trackFileUpload } = require('../middleware/metricsMiddleware');

// Track Cloudinary uploads
router.post('/cloudinary', trackFileUpload('cloudinary'), UploadController.uploadToCloudinary);

// Track local uploads
router.post('/local', trackFileUpload('local'), UploadController.uploadToLocal);

module.exports = router;
```

## 📈 Metrics được tự động thu thập

### HTTP Metrics (tự động cho tất cả requests)
- ✅ `http_requests_total` - Tổng số requests
- ✅ `http_request_duration_seconds` - Thời gian xử lý
- ✅ `http_errors_total` - Tổng số lỗi

### WebSocket Metrics (đã tích hợp sẵn)
- ✅ `socketio_active_connections` - Số connections
- ✅ `socketio_events_total` - Tổng số events

### Database Metrics
- ✅ `mongodb_connection_status` - Trạng thái kết nối
- ⚠️ `mongodb_query_duration_seconds` - Cần tích hợp thủ công
- ⚠️ `mongodb_operations_total` - Cần tích hợp thủ công

### Business Metrics (cần tích hợp middleware)
- 📊 `user_logins_total` - Đăng nhập
- 📊 `user_registrations_total` - Đăng ký
- 📊 `orders_total` - Đơn hàng
- 📊 `order_value_vnd` - Giá trị đơn
- 📊 `products_viewed_total` - Xem sản phẩm
- 📊 `cart_operations_total` - Thao tác giỏ hàng
- 📊 `payment_transactions_total` - Giao dịch
- 📊 `payment_amount_vnd` - Giá trị giao dịch
- 📊 `file_uploads_total` - Upload file
- 📊 `upload_size_bytes` - Kích thước file

## 🔍 Queries Grafana hay dùng

### User Activity
```promql
# Số lượng đăng ký mới (1 giờ qua)
increase(user_registrations_total[1h])

# Tỷ lệ đăng nhập thành công
rate(user_logins_total{status="success"}[5m]) / rate(user_logins_total[5m]) * 100

# Phân bố giới tính người dùng mới
sum by (gender) (user_registrations_total)
```

### Orders & Revenue
```promql
# Tổng số đơn hàng theo trạng thái
sum by (status) (orders_total)

# Doanh thu trung bình
avg(order_value_vnd)

# Doanh thu theo thời gian
sum(rate(order_value_vnd_sum[5m]))

# Giá trị đơn hàng p95
histogram_quantile(0.95, order_value_vnd)
```

### Product Performance
```promql
# Top 10 sản phẩm được xem nhiều nhất
topk(10, sum by (product_id) (products_viewed_total))

# Lượt xem theo danh mục
sum by (category) (products_viewed_total)
```

### Cart Analytics
```promql
# Số lượng thao tác giỏ hàng
sum by (operation) (cart_operations_total)

# Tỷ lệ conversion (add to cart -> order)
sum(orders_total) / sum(cart_operations_total{operation="add"}) * 100
```

### Payment Metrics
```promql
# Tỷ lệ thanh toán thành công
rate(payment_transactions_total{status="success"}[5m]) / rate(payment_transactions_total[5m]) * 100

# So sánh payment providers
sum by (provider) (payment_transactions_total)

# Giá trị thanh toán trung bình
avg(payment_amount_vnd)
```

### Performance
```promql
# Response time trung bình
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# Error rate
rate(http_errors_total[5m])

# Requests per second
rate(http_requests_total[1m])
```

## 🎨 Dashboard Panel Suggestions

### Panel 1: Revenue Today
```
Query: sum(increase(order_value_vnd_sum[24h]))
Type: Stat
Unit: VND
```

### Panel 2: Orders Status
```
Query: sum by (status) (orders_total)
Type: Pie Chart
```

### Panel 3: User Activity
```
Query: rate(user_logins_total[5m])
Type: Graph
```

### Panel 4: Top Products
```
Query: topk(5, sum by (product_id) (products_viewed_total))
Type: Bar Chart
```

### Panel 5: Payment Success Rate
```
Query: rate(payment_transactions_total{status="success"}[5m]) / rate(payment_transactions_total[5m]) * 100
Type: Gauge
Thresholds: <80 = Red, 80-95 = Yellow, >95 = Green
```

## ⚡ Tips

1. **Không track mọi thứ**: Chỉ track metrics quan trọng
2. **Sử dụng labels hợp lý**: Tránh quá nhiều unique labels
3. **Monitor performance**: Metrics không nên làm chậm app
4. **Set retention**: Cấu hình Prometheus để giữ data phù hợp
5. **Create alerts**: Setup alerts cho các metrics quan trọng

## 🚨 Lưu ý quan trọng

- Middleware được thiết kế để **không làm crash app** nếu có lỗi
- Tất cả errors trong middleware đều được silent fail
- Nên test kỹ sau khi tích hợp
- Kiểm tra `/metrics` endpoint để xem metrics có đúng không
- Monitor memory usage khi có nhiều labels

---

**Happy Monitoring! 📊**
