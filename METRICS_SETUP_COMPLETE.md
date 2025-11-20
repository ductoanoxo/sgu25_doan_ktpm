# 📊 Prometheus & Grafana - Monitoring Setup Complete

## ✅ Đã cài đặt thành công

### 1. Core Metrics System
- ✅ **metrics.js** - File cấu hình tất cả metrics
- ✅ **metricsMiddleware.js** - Middleware để track business metrics
- ✅ Tích hợp vào **index.js** với HTTP và WebSocket tracking

### 2. Metrics được thu thập

#### 🌐 HTTP Metrics (Tự động)
- `http_requests_total` - Tổng số HTTP requests
- `http_request_duration_seconds` - Thời gian xử lý request
- `http_errors_total` - Tổng số lỗi HTTP

#### 🔌 WebSocket Metrics (Tự động)
- `socketio_active_connections` - Số kết nối đang active
- `socketio_events_total` - Tổng số events Socket.IO

#### 💾 Database Metrics
- `mongodb_connection_status` - Trạng thái MongoDB
- `mongodb_query_duration_seconds` - Thời gian query
- `mongodb_operations_total` - Tổng số operations

#### 👥 User Metrics (Cần tích hợp middleware)
- `user_registrations_total` - Đăng ký user
- `user_logins_total` - Đăng nhập user

#### 🛒 Business Metrics (Cần tích hợp middleware)
- `orders_total` - Tổng đơn hàng
- `order_value_vnd` - Giá trị đơn hàng
- `products_viewed_total` - Sản phẩm được xem
- `cart_operations_total` - Thao tác giỏ hàng

#### 💳 Payment Metrics (Cần tích hợp middleware)
- `payment_transactions_total` - Giao dịch thanh toán
- `payment_amount_vnd` - Giá trị thanh toán

#### 📤 Upload Metrics (Cần tích hợp middleware)
- `file_uploads_total` - Upload file
- `upload_size_bytes` - Kích thước file

#### ⚙️ System Metrics (Tự động)
- `nodejs_*` - CPU, Memory, Event Loop, Heap, GC...

### 3. Infrastructure

#### Docker Services đã thêm:
- **Prometheus** (port 9090)
- **Grafana** (port 3002)
- **MongoDB Exporter** (port 9216)

#### Files đã tạo:
```
├── server_app/
│   ├── metrics.js                    ✅ Core metrics definitions
│   ├── middleware/
│   │   └── metricsMiddleware.js      ✅ Business metrics tracking
│   └── METRICS_INTEGRATION_GUIDE.md  ✅ Hướng dẫn tích hợp
├── prometheus.yml                     ✅ Prometheus config
├── grafana/
│   └── provisioning/
│       ├── datasources/
│       │   └── prometheus.yml        ✅ Auto datasource
│       └── dashboards/
│           ├── dashboard.yml         ✅ Dashboard config
│           └── clothes-shop-dashboard.json ✅ Sample dashboard
└── PROMETHEUS_GRAFANA_GUIDE.md       ✅ Hướng dẫn sử dụng
```

## 🚀 Quick Start

### 1. Cài đặt dependencies

```bash
cd server_app
npm install
```

### 2. Khởi động tất cả services

```bash
cd ..
docker compose up -d
```

### 3. Truy cập

- **Server App**: http://localhost:8000
- **Metrics Endpoint**: http://localhost:8000/metrics
- **Health Check**: http://localhost:8000/health
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3002
  - Username: `admin`
  - Password: `admin123`

## 📈 Xem Metrics

### Option 1: Prometheus UI

1. Mở http://localhost:9090
2. Vào **Graph** tab
3. Thử queries:
```promql
# HTTP requests
sum(rate(http_requests_total[5m]))

# Active connections
socketio_active_connections

# Memory usage
nodejs_heap_size_used_bytes / 1024 / 1024
```

### Option 2: Grafana Dashboard

1. Đăng nhập Grafana: http://localhost:3002
2. Datasource **Prometheus** đã tự động được thêm
3. Import dashboard:
   - Click **+** → **Import**
   - Upload file: `grafana/provisioning/dashboards/clothes-shop-dashboard.json`
   - Hoặc tạo dashboard mới từ đầu

## 🔧 Tích hợp Metrics vào Code

### Bước 1: Import middleware vào router

**Ví dụ: `API/Router/user.router.js`**

```javascript
const { trackUserLogin, trackUserRegistration } = require('../middleware/metricsMiddleware');

// Thêm middleware vào route
router.post('/signin', trackUserLogin(), UserController.signin);
router.post('/signup', trackUserRegistration, UserController.signup);
```

### Bước 2: Áp dụng cho các router khác

Xem file **`server_app/METRICS_INTEGRATION_GUIDE.md`** để biết chi tiết cách tích hợp vào:
- ✅ User Router (login, signup)
- ✅ Product Router (view tracking)
- ✅ Order Router (order creation)
- ✅ Cart Router (cart operations)
- ✅ Payment Router (Stripe, PayPal)
- ✅ Upload Router (Cloudinary)

## 📊 Dashboard Panels

Dashboard mẫu bao gồm:

1. **Revenue Today** - Doanh thu hôm nay
2. **Total Orders** - Tổng đơn hàng
3. **Active Users** - Users đang online
4. **MongoDB Status** - Trạng thái database
5. **Orders by Status** - Phân bố đơn hàng
6. **Revenue Trend** - xu hướng doanh thu
7. **Top Products** - Sản phẩm được xem nhiều
8. **Request Rate** - Tốc độ requests
9. **Response Time** - Thời gian phản hồi
10. **Error Rate** - Tỷ lệ lỗi
11. **User Registrations** - Đăng ký theo giới tính
12. **Login Success Rate** - Tỷ lệ đăng nhập thành công
13. **Payment Success Rate** - Tỷ lệ thanh toán thành công
14. **Memory Usage** - Sử dụng RAM
15. **CPU Usage** - Sử dụng CPU
16. **Cart Operations** - Thao tác giỏ hàng
17. **Upload Success Rate** - Tỷ lệ upload thành công
18. **Socket.IO Events** - Events realtime

## 🎯 Useful Queries

### Business Intelligence

```promql
# Doanh thu hôm nay
sum(increase(order_value_vnd_sum[24h]))

# Top 5 sản phẩm hot nhất
topk(5, sum by (product_id) (products_viewed_total))

# Tỷ lệ conversion (add to cart → order)
sum(orders_total) / sum(cart_operations_total{operation="add"}) * 100

# Giá trị đơn hàng trung bình
avg(order_value_vnd)
```

### Performance Monitoring

```promql
# Response time p95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rate
rate(http_errors_total[5m])

# Memory leak detection
rate(nodejs_heap_size_used_bytes[1h])
```

### User Behavior

```promql
# Người dùng mới (1 giờ qua)
increase(user_registrations_total[1h])

# Tỷ lệ đăng nhập thành công
rate(user_logins_total{status="success"}[5m]) / rate(user_logins_total[5m]) * 100
```

## 🚨 Alerting (Tùy chọn)

Tạo alerts trong Grafana cho:

1. **High Error Rate**
   - Condition: Error rate > 5%
   - Action: Send notification

2. **Slow Response Time**
   - Condition: p95 response time > 2s
   - Action: Alert team

3. **Low Payment Success**
   - Condition: Payment success < 90%
   - Action: Urgent alert

4. **MongoDB Down**
   - Condition: mongodb_connection_status = 0
   - Action: Critical alert

## 📚 Documentation

- **PROMETHEUS_GRAFANA_GUIDE.md** - Hướng dẫn tổng quan
- **server_app/METRICS_INTEGRATION_GUIDE.md** - Hướng dẫn tích hợp chi tiết
- **server_app/metrics.js** - Source code metrics definitions
- **server_app/middleware/metricsMiddleware.js** - Middleware implementations

## 🐛 Troubleshooting

### Metrics endpoint trả về empty?

```bash
# Kiểm tra server có chạy không
docker ps | grep server_app

# Xem logs
docker logs server_app

# Test endpoint
curl http://localhost:8000/metrics
```

### Prometheus không scrape được?

1. Vào http://localhost:9090/targets
2. Kiểm tra status của `server_app`
3. Nếu DOWN, check network: `docker network ls`

### Grafana không hiển thị data?

1. Check datasource: Settings → Data Sources → Prometheus → Test
2. Verify query syntax
3. Check time range (Last 6h, 24h, etc.)

## 💡 Best Practices

1. ✅ **Chỉ track metrics quan trọng** - Tránh track quá nhiều
2. ✅ **Sử dụng labels hợp lý** - Tránh cardinality cao
3. ✅ **Monitor metrics performance** - Đảm bảo không làm chậm app
4. ✅ **Set up alerts** - Alert cho các metrics critical
5. ✅ **Regular review** - Xem và optimize dashboards thường xuyên

## 🎓 Next Steps

1. ✅ Tích hợp middleware vào các router
2. ✅ Customize dashboard theo nhu cầu
3. ✅ Set up alerting rules
4. ✅ Export dashboard để backup
5. ✅ Monitor và tune performance

## 📞 Support

Nếu gặp vấn đề:
1. Check logs: `docker logs <container_name>`
2. Verify configs trong file `prometheus.yml`
3. Test metrics endpoint: http://localhost:8000/metrics
4. Review integration guide

---

**🎉 Happy Monitoring! Chúc bạn thành công với đồ án! 📊✨**
