# Communication View - E-Commerce System (Tổng Quan)

## Sơ Đồ Kiến Trúc Hệ Thống

```
                              ┌─────────────────────────────────────────────────┐
                              │           Client Browser                        │
                              │  - HTTPS 443                                    │
                              │  - HTML/JSON                                    │
                              │  - Cookie, JWT                                  │
                              └─────────────────┬───────────────────────────────┘
                                                │
                              ┌─────────────────▼───────────────────────────────┐
                              │      Frontend (Next.js App Router)              │
                              │                                                 │
                              │  Web UI:                                        │
                              │  - CSR/SSR (Next.js)                           │
                              │  - SSR/CSR                                      │
                              │  - fetch() API                                  │
                              │                                                 │
                              │  Client App (Port 3000):                        │
                              │  - Trang chủ, sản phẩm, giỏ hàng               │
                              │  - Thanh toán, lịch sử đơn hàng                │
                              │  - Tìm kiếm, yêu thích                          │
                              │                                                 │
                              │  Admin App (Port 3001):                         │
                              │  - Quản lý sản phẩm, danh mục                  │
                              │  - Quản lý đơn hàng, người dùng                │
                              │  - Dashboard, thống kê                          │
                              └─────────────────┬───────────────────────────────┘
                                                │
                                    ┌───────────┴──────────────┐
                                    │                          │
                              HTTPS 443                   WebSocket
                              REST API                    (Socket.IO)
                                    │                          │
                              ┌─────▼──────────────────────────▼──────────────┐
                              │      Backend API (Node.js)                    │
                              │                                               │
                              │  REST API:                                    │
                              │  - Auth                                       │
                              │  - Products                                   │
                              │  - Orders                                     │
                              │  - Uploads                                    │
                              │  - Admin                                      │
                              │  (JWT cookie, HttpOnly)                       │
                              │                                               │
                              │  Real-time:                                   │
                              │  - Socket.IO (Order notifications)            │
                              │  - WebSocket events                           │
                              └────┬─────────┬──────────┬────────┬───────────┘
                                   │         │          │        │
                     ┌─────────────┘         │          │        └─────────────┐
                     │                       │          │                      │
              TCP 5432              HTTPS 443│          │HTTPS 443      SMTP 587
            PostgreSQL            Cloudinary │          │Stripe       Email Service
          (port 27017)              Storage  │          │Payment      (Gmail SMTP)
                     │                       │          │                      │
         ┌───────────▼────────┐  ┌──────────▼─────┐ ┌──▼────────────┐ ┌──────▼──────┐
         │  MongoDB Atlas     │  │  Cloudinary    │ │    Stripe     │ │  Gmail SMTP │
         │  (HTTPS 443)       │  │  (HTTPS 443)   │ │  (HTTPS 443)  │ │ (smtp.gmail │
         │                    │  │                │ │               │ │ .com:587)   │
         │  Database: mydb    │  │  Cloud Storage │ │  Payment      │ │  STARTTLS   │
         │  - Kết nối: Kênh   │  │  Upload/GET    │ │  Gateway      │ │             │
         │    giao tiếp       │  │  files         │ │               │ │  Email      │
         │    (protocol, cổng)│  │                │ │               │ │  verify/    │
         │                    │  │                │ │               │ │  notify     │
         └────────────────────┘  └────────────────┘ └───────────────┘ └─────────────┘

Database: Node/Service runtime
MongoDB: Kênh giao tiếp (protocol, cổng)
```

## 1. Lượng Chính (Luồng Đặt Hàng)

### Bước 1: Đăng nhập/Xác thực
```
1) Client Browser gửi request:
   POST /api/auth/login → JWT cookie
   
2) Xem danh sách bài đăng:
   GET /api/listings
   
3) Tải bài & Upload ảnh:
   POST /api/uploads (multipart → Supabase) → lưu URL vào DB
```

### Bước 2: Duyệt sản phẩm
```
4) Duyệt bài:
   PUT /api/admin/listings/:id/approve → Email
   
5) Báo cáo bài đăng:
   POST /api/reports (Admin)
   GET /api/reports
   PUT /api/reports/:id/resolve
```

### Bước 3: Quản lý đơn hàng
```
Client → POST /api/Payment/order
Server:
  1. Tạo Order, Detail_Order trong MongoDB
  2. Gửi email xác nhận (Nodemailer)
  3. Socket.IO emit('send_order')
Admin → Nhận thông báo real-time qua WebSocket
```

## 2. Endpoint (Tổng Quan)

### Auth (Xác thực)
```
POST /api/auth/register | login | logout
GET /api/auth/me
```

### Listings (Danh sách sản phẩm)
```
GET /api/listings | /:id
POST /api/listings
PUT /api/listings/:id
DELETE /api/listings/:id
```

### Uploads (Tải lên)
```
POST /api/uploads
DELETE /api/uploads/:filename
```

### Admin (Quản trị)
```
GET /api/admin/users
PUT /api/admin/listings/:id/approve
```

### Reports (Báo cáo)
```
POST /api/reports
GET /api/reports
PUT /api/reports/:id/resolve
```

## 3. Chi Tiết Endpoint và Giao Thức

### 3.1. Client Application (Khách Hàng) - Port 3000

- **Framework**: React.js
- **Port**: 3000
- **Chức năng chính**:
  - Xem sản phẩm, shop, danh mục
  - Giỏ hàng, yêu thích
  - Đặt hàng, thanh toán (Stripe, PayPal, MoMo)
  - Quản lý tài khoản, lịch sử đơn hàng
  - Tìm kiếm, lọc sản phẩm
  - Xem sự kiện, liên hệ

### 3.2. Admin Application (Quản Trị) - Port 3001

- **Framework**: React.js
- **Port**: 3001
- **Chức năng chính**:
  - Quản lý sản phẩm (CRUD)
  - Quản lý danh mục, người dùng, quyền
  - Quản lý đơn hàng (xác nhận, giao hàng, hoàn thành, hủy)
  - Quản lý coupon, sale/khuyến mãi
  - Dashboard thống kê
  - Nhận thông báo đơn hàng mới (real-time)

### 3.3. Server Application (Backend) - Port 8000

- **Framework**: Node.js + Express.js
- **Port**: 8000
- **Database**: MongoDB Atlas
- **Công nghệ**:
  - **Socket.IO**: Real-time communication
  - **Cloudinary**: Upload và quản lý hình ảnh
  - **Stripe**: Thanh toán quốc tế
  - **PayPal & MoMo**: Thanh toán
  - **Nodemailer**: Gửi email
  - **bcrypt**: Mã hóa mật khẩu
  - **Prometheus**: Metrics monitoring
  - **Multer**: Upload file

### 3.4. MongoDB Atlas (Database)

- **Host**: ktpm.dwb8wtz.mongodb.net
- **Database**: mydb
- **Protocol**: TCP (MongoDB Wire Protocol)
- **Port**: 27017
- **Collections**:
  - users, products, categories, orders, detail_orders
  - carts, comments, favorites, notes
  - payments, deliveries, coupons, sales, permissions

### 3.5. Cloudinary (Cloud Storage) - HTTPS 443

- **Protocol**: HTTPS
- **API**: Cloudinary Upload API
- **Authentication**: API Key + API Secret
- **Chức năng**:
  - Upload: `cloudinary.uploader.upload()`
  - Delete: `cloudinary.uploader.destroy()`
- **Folder**: fashion-shop/
- **Max File Size**: 5MB
- **Supported Formats**: jpg, jpeg, png, gif, webp

### 3.6. Stripe (Payment Gateway) - HTTPS 443

- **Protocol**: HTTPS
- **API**: Stripe Payment Intents API
- **Authentication**: Secret Key
- **Endpoints**:
  - Create Payment Intent: `/v1/payment_intents`
  - Confirm Payment: `/v1/payment_intents/:id/confirm`
  - Webhooks: Receive payment events

### 3.7. Gmail SMTP (Email Service) - SMTP 587

- **Protocol**: SMTP/STARTTLS
- **Host**: smtp.gmail.com
- **Port**: 587
- **Function**: Send order confirmation emails
- **Library**: Nodemailer

## 4. Giao Thức Giao Tiếp Chi Tiết

### 4.1. REST API Communication

#### **Client App → Server** (HTTP/HTTPS - Port 8000)

**Base URL**: `http://localhost:8000` (hoặc `REACT_APP_API_URL`)  
**Content-Type**: `application/json`


**Public APIs:**

- `GET /api/Product` - Lấy danh sách sản phẩm
- `GET /api/Product/:id` - Chi tiết sản phẩm
- `GET /api/Product/category` - Sản phẩm theo danh mục
- `GET /api/Product/category/gender` - Sản phẩm theo giới tính
- `GET /api/Product/category/pagination` - Phân trang sản phẩm
- `GET /api/Category` - Danh sách danh mục
- `POST /api/User` - Đăng ký tài khoản
- `GET /api/User/detail/login` - Đăng nhập
- `GET /api/Comment` - Lấy bình luận
- `POST /api/Comment` - Thêm bình luận

**User APIs (Authenticated):**

- `GET /api/User/:id` - Thông tin người dùng
- `PUT /api/User` - Cập nhật thông tin
- `POST /api/User/change-password` - Đổi mật khẩu
- `GET /api/favorite` - Danh sách yêu thích
- `POST /api/favorite` - Thêm/xóa yêu thích
- `POST /api/Note` - Tạo ghi chú giao hàng

**Order APIs:**

- `POST /api/Payment/order` - Tạo đơn hàng
- `GET /api/Payment/order/:id` - Lịch sử đơn hàng
- `GET /api/Payment/order/detail/:id` - Chi tiết đơn hàng
- `GET /api/Payment/payments` - Danh sách phương thức thanh toán
- `POST /api/Payment/email` - Gửi email xác nhận
- `POST /api/Payment/momo` - Thanh toán MoMo

**Stripe Payment APIs:**

- `POST /api/stripe/create-payment-intent` - Tạo payment intent
- `POST /api/stripe/confirm-payment` - Xác nhận thanh toán
- `POST /api/stripe/webhook` - Webhook từ Stripe

**Upload APIs:**

- `POST /api/upload` - Upload ảnh lên Cloudinary

#### **Admin App → Server** (HTTP/HTTPS - Port 8000)

**Admin Product APIs:**

- `GET /api/admin/Product` - Danh sách sản phẩm (admin)
- `POST /api/admin/Product` - Tạo sản phẩm mới
- `PUT /api/admin/Product/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/Product/:id` - Xóa sản phẩm

**Admin Category APIs:**

- `GET /api/admin/Category` - Danh sách danh mục
- `POST /api/admin/Category` - Tạo danh mục
- `PUT /api/admin/Category/:id` - Cập nhật danh mục
- `DELETE /api/admin/Category/:id` - Xóa danh mục

**Admin User APIs:**

- `GET /api/admin/User` - Danh sách nhân viên
- `POST /api/admin/User` - Tạo tài khoản nhân viên
- `PUT /api/admin/User/:id` - Cập nhật nhân viên
- `DELETE /api/admin/User/:id` - Xóa nhân viên

**Admin Permission APIs:**

- `GET /api/admin/Permission` - Danh sách quyền
- `POST /api/admin/Permission` - Tạo quyền mới
- `PUT /api/admin/Permission/:id` - Cập nhật quyền
- `DELETE /api/admin/Permission/:id` - Xóa quyền

**Admin Order APIs:**

- `GET /api/admin/Order` - Danh sách đơn hàng
- `PUT /api/admin/Order/:id` - Cập nhật trạng thái đơn hàng
- `DELETE /api/admin/Order/:id` - Hủy đơn hàng

**Admin Coupon APIs:**

- `GET /api/admin/Coupon` - Danh sách mã giảm giá
- `POST /api/admin/Coupon` - Tạo coupon
- `PUT /api/admin/Coupon/:id` - Cập nhật coupon
- `DELETE /api/admin/Coupon/:id` - Xóa coupon

**Admin Sale APIs:**

- `GET /api/admin/Sale` - Danh sách khuyến mãi
- `POST /api/admin/Sale` - Tạo sale
- `PUT /api/admin/Sale/:id` - Cập nhật sale
- `DELETE /api/admin/Sale/:id` - Xóa sale

### 4.2. WebSocket Communication (Socket.IO)

**URL**: `http://localhost:8000` (hoặc `REACT_APP_SOCKET_URL`)  
**Protocol**: WebSocket (Socket.IO)

**Events:**

- **Client → Server:**
  - `send_order` - Khách hàng đặt hàng thành công
  
- **Server → Admin:**
  - `receive_order` - Admin nhận thông báo đơn hàng mới

**Kết nối:**

```javascript
// Client App (Checkout.jsx, Paypal.jsx, StripePayment.jsx)
const socket = io(API_URL, {
    transports: ['websocket', 'polling']
});

// Gửi thông báo khi đặt hàng
socket.emit('send_order', "Có người vừa đặt hàng");

// Admin App (Order.jsx, ConfirmOrder.jsx)
const socket = io(API_URL, {
    transports: ['websocket', 'polling']
});

// Nhận thông báo real-time
socket.on('receive_order', (data) => {
    // Refresh danh sách đơn hàng
    // Hiển thị notification
});
```

### 4.3. Database Communication

**Server → MongoDB Atlas:**

- **Protocol**: MongoDB Protocol (TCP)
- **Port**: 27017
- **Connection String**: 
  ```
  mongodb+srv://toantra349:<password>@ktpm.dwb8wtz.mongodb.net/mydb
  ```
- **Library**: Mongoose ODM
- **Connection Options**:
  - `useNewUrlParser: true`
  - `useUnifiedTopology: true`

**Database Operations:**

- **CRUD Operations** trên các collections
- **Populate** cho foreign key relationships
- **Aggregation** cho thống kê
- **Transactions** cho đơn hàng

### 4.4. External Services Communication

#### Cloudinary (Image Storage) - HTTPS 443

**Protocol**: HTTPS  
**API**: Cloudinary Upload API  
**Authentication**: API Key + API Secret

**Endpoints:**
- Upload: `cloudinary.uploader.upload()`
- Delete: `cloudinary.uploader.destroy()`

**Configuration:**
- Folder: `fashion-shop/`
- Max File Size: 5MB
- Supported Formats: jpg, jpeg, png, gif, webp

#### Stripe (Payment Gateway) - HTTPS 443

**Protocol**: HTTPS  
**API**: Stripe Payment Intents API  
**Authentication**: Secret Key

**Endpoints:**
- Create Payment Intent: `/v1/payment_intents`
- Confirm Payment: `/v1/payment_intents/:id/confirm`
- Webhooks: Receive payment events

#### Nodemailer (Email Service) - SMTP 587

**Protocol**: SMTP/HTTPS  
**Host**: smtp.gmail.com  
**Port**: 587  
**Security**: STARTTLS  
**Function**: Send order confirmation emails

## 5. Data Flow Examples (Ví Dụ Luồng Dữ Liệu)

### 5.1. Đặt Hàng (Order Flow)

```
1. Client App:
   - User chọn sản phẩm → Thêm vào giỏ hàng
   - User checkout → Nhập thông tin giao hàng
   - Chọn phương thức thanh toán

2. Payment Processing:
   [Stripe Payment]
   Client → POST /api/stripe/create-payment-intent
   Server → Stripe API (HTTPS 443) → Return clientSecret
   Client → Stripe.js confirmPayment()
   Stripe → Server webhook → Confirm payment

3. Order Creation:
   Client → POST /api/Payment/order
   Server → Create Order, Detail_Order in MongoDB (TCP 27017)
   Server → Send email confirmation (SMTP 587)
   Server → Socket.IO emit('send_order')

4. Real-time Notification:
   Server → WebSocket → Admin App
   Admin → Receive notification → Refresh order list
```

### 5.2. Quản Lý Sản Phẩm (Product Management Flow)

```
1. Admin creates product:
   Admin App → Upload ảnh → POST /api/upload
   Server → Cloudinary (HTTPS 443) uploads image
   Cloudinary → Return image URL
   
2. Save product:
   Admin App → POST /api/admin/Product (with image URL)
   Server → Save to MongoDB (TCP 27017)
   Server → Response success
   
3. Display product:
   Client App → GET /api/Product
   Server → Query MongoDB
   MongoDB → Return products with image URLs
   Client → Display images from Cloudinary CDN
```

### 5.3. Authentication Flow

```
1. Login:
   Client/Admin → GET /api/User/detail/login?username=x&password=y
   Server → Query user from MongoDB (TCP 27017)
   Server → bcrypt.compare(password, hashedPassword)
   Server → Return user info + permission
   Client → Store in sessionStorage/localStorage

2. Access Protected Routes:
   Client → GET /api/User/:id (with session)
   Server → Verify user session
   Server → Return user data
```

## 6. Security Measures (Biện Pháp Bảo Mật)

### 6.1. Authentication & Authorization

- **Password Hashing**: bcrypt với salt
- **Permission-based Access Control**: Admin, Nhân Viên, Khách hàng
- **Session Management**: sessionStorage/localStorage

### 6.2. API Security

- **CORS**: Enabled cho cross-origin requests
- **Request Validation**: Body parser, input sanitization
- **File Upload Security**: 
  - Size limit: 5MB
  - File type validation
  - Virus scanning (recommended)

### 6.3. Database Security

- **Connection**: SSL/TLS encryption (MongoDB Atlas)
- **Authentication**: Username/password
- **Network**: MongoDB Atlas firewall
- **Port**: TCP 27017

### 6.4. Payment Security

- **Stripe**: PCI DSS compliant
- **HTTPS**: All payment data encrypted (HTTPS 443)
- **Webhook Signature**: Verify Stripe events

## 7. Monitoring & Observability (Giám Sát Hệ Thống)

### 7.1. Prometheus Metrics

**Endpoint**: `GET /metrics`  
**Metrics:**
- `http_request_duration_seconds` (histogram)
- `http_request_total` (counter)
- `http_errors_total` (counter)
- `active_connections` (gauge)
- `socketio_events_total` (counter)
- `mongodb_connection_status` (gauge)

### 7.2. Health Check

**Endpoint**: `GET /health`  
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T...",
  "mongodb": "connected"
}
```

### 7.3. Monitoring Stack (Docker Compose)

- **Prometheus** (Port 9090): Metrics collection
- **Grafana** (Port 3002): Visualization
- **MongoDB Exporter** (Port 9216): MongoDB metrics

## 8. Deployment Architecture (Kiến Trúc Triển Khai)

### 8.1. Docker Compose Services
```yaml
Services:
  - server_app (Port 8000)
  - client_app (Port 3000)
  - admin_app (Port 3001)
  - mongo (Port 27017)
  - prometheus (Port 9090)
  - grafana (Port 3002)
  - mongodb-exporter (Port 9216)
```

### 7.2. Environment Variables
```
Server:
  - NODE_ENV, PORT
  - MONGO_URL
  - CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET
  - STRIPE_SECRET_KEY

Client/Admin:
  - REACT_APP_API_URL
  - REACT_APP_SOCKET_URL
  - REACT_APP_STRIPE_PUBLISHABLE_KEY
```

## 8. Scalability Considerations

### 8.1. Horizontal Scaling
- Load balancer phía trước server_app
- Multiple server instances
- Session store (Redis) cho shared sessions

### 8.2. Caching
- CDN cho static assets (Cloudinary)
- Redis cache cho API responses
- Browser caching

### 8.3. Database Optimization
- Indexing cho queries thường dùng
- Connection pooling
- Read replicas cho read-heavy operations

## 9. Error Handling & Resilience

### 9.1. Graceful Shutdown
```javascript
SIGTERM/SIGINT → Close HTTP server → Close MongoDB connection → Exit
```

### 9.2. Error Responses
- Consistent error format
- HTTP status codes
- Error logging

### 9.3. Retry Mechanisms
- Exponential backoff cho external APIs
- Circuit breaker pattern (recommended)

## 10. Future Enhancements

- [ ] API Gateway (Kong, AWS API Gateway)
- [ ] Service Mesh (Istio, Linkerd)
- [ ] Message Queue (RabbitMQ, Kafka) cho async tasks
- [ ] Redis Cache Layer
- [ ] Elasticsearch cho full-text search
- [ ] CDN cho static assets
- [ ] Rate Limiting & Throttling
- [ ] API Versioning
- [ ] GraphQL API layer