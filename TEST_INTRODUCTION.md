# TÀI LIỆU KIỂM THỬ - GIỚI THIỆU

## 1. GIỚI THIỆU (INTRODUCTION)

### 1.1. Mục đích (Purpose)

Mục đích của tài liệu này là xác định chiến lược kiểm thử tổng thể, các mục tiêu, phạm vi, phương pháp tiếp cận, nguồn lực, lịch trình và các sản phẩm giao cho dự án **Website Thương mại Điện tử Thời trang (SGU25_DOAN_KTPM)**. Kế hoạch kiểm thử này đóng vai trò như một hướng dẫn cho tất cả các hoạt động kiểm thử nhằm đảm bảo rằng hệ thống được phát triển đáp ứng các yêu cầu chức năng và phi chức năng đã xác định, cung cấp một sản phẩm chất lượng cao, ổn định và an toàn trước khi triển khai.

Cụ thể, tài liệu này sẽ:

- **Xác định chiến lược kiểm thử**: Thiết lập phương pháp luận và quy trình kiểm thử cho toàn bộ dự án, từ kiểm thử đơn vị (unit testing) đến kiểm thử chấp nhận (acceptance testing).

- **Định nghĩa phạm vi kiểm thử**: Xác định rõ ràng những gì sẽ được kiểm thử và những gì nằm ngoài phạm vi, đảm bảo tập trung nguồn lực vào các yếu tố quan trọng nhất.

- **Lập kế hoạch nguồn lực**: Xác định đội ngũ kiểm thử, công cụ, môi trường và thời gian cần thiết để thực hiện các hoạt động kiểm thử hiệu quả.

- **Đảm bảo chất lượng sản phẩm**: Xác minh rằng hệ thống hoạt động chính xác, ổn định và đáp ứng đầy đủ nhu cầu của người dùng cuối (khách hàng và quản trị viên).

- **Hỗ trợ ra quyết định**: Cung cấp thông tin đáng tin cậy cho việc quyết định triển khai sản phẩm lên môi trường production.

**Đối tượng sử dụng tài liệu:**
- Trưởng nhóm dự án và Quản lý Dự án
- Kỹ sư Kiểm thử (QA Engineers/Testers)
- Lập trình viên Phần mềm (Developers)
- Giảng viên hướng dẫn và Ban giám khảo
- Các thành viên nhóm phát triển

---

### 1.2. Thông tin Nền tảng (Background Information)

Dự án **Website Thương mại Điện tử Thời trang (SGU25_DOAN_KTPM)** là một hệ thống bán hàng trực tuyến chuyên về sản phẩm thời trang, hoạt động độc lập và được tối ưu hóa trên nền tảng web, được thiết kế để hỗ trợ cả khách hàng và quản trị viên cửa hàng trong việc quản lý quy trình mua sắm, thanh toán và quản lý đơn hàng.

**Bối cảnh Dự án:**

Trong bối cảnh thương mại điện tử phát triển mạnh mẽ tại Việt Nam, nhu cầu mua sắm thời trang trực tuyến ngày càng tăng cao. Dự án được phát triển nhằm cung cấp một giải pháp hoàn chỉnh cho việc kinh doanh thời trang trực tuyến, từ việc trưng bày sản phẩm, quản lý giỏ hàng, xử lý thanh toán đến quản lý đơn hàng và tồn kho.

**Tổng quan Hệ thống:**

SGU25_DOAN_KTPM là một ứng dụng web full-stack được xây dựng trên kiến trúc **MERN Stack** (MongoDB, Express.js, React, Node.js), bao gồm ba thành phần chính:

1. **Ứng dụng Khách hàng (Client Application)** - `client_app/`
   - Giao diện web dành cho người dùng cuối (khách hàng)
   - Được xây dựng bằng React 18.x với Redux để quản lý trạng thái ứng dụng
   - Cung cấp các chức năng:
     * Duyệt và tìm kiếm sản phẩm thời trang theo danh mục, giá cả, size
     * Xem chi tiết sản phẩm với hình ảnh, mô tả, đánh giá
     * Quản lý giỏ hàng và danh sách yêu thích (wishlist)
     * Đặt hàng và thanh toán trực tuyến (Stripe, PayPal)
     * Theo dõi trạng thái đơn hàng và lịch sử mua hàng
     * Đăng ký, đăng nhập và quản lý hồ sơ cá nhân

2. **Ứng dụng Quản trị (Admin Application)** - `admin_app/`
   - Dashboard quản trị dành cho chủ cửa hàng và nhân viên
   - Giao diện quản lý được xây dựng bằng React với Bootstrap
   - Cung cấp các chức năng:
     * Quản lý sản phẩm (thêm, sửa, xóa, cập nhật tồn kho)
     * Quản lý danh mục và phân loại sản phẩm
     * Xử lý và cập nhật trạng thái đơn hàng
     * Quản lý người dùng và phân quyền (Admin, Nhân viên)
     * Tạo và quản lý mã giảm giá (coupon)
     * Thiết lập chương trình khuyến mãi (sale/promotion)
     * Xem báo cáo doanh thu và tồn kho

3. **Ứng dụng Máy chủ (Server Application)** - `server_app/`
   - RESTful API backend xử lý nghiệp vụ và dữ liệu
   - Được xây dựng bằng Node.js 18.x với framework Express.js
   - Kết nối với cơ sở dữ liệu MongoDB Atlas (Cloud Database)
   - Cung cấp các dịch vụ:
     * API xác thực và phân quyền người dùng (JWT, bcrypt)
     * API quản lý sản phẩm, đơn hàng, giỏ hàng
     * Tích hợp cổng thanh toán Stripe và PayPal
     * Xử lý upload và quản lý hình ảnh sản phẩm
     * Thông báo real-time bằng Socket.IO
     * Quản lý session và bảo mật

**Công nghệ và Công cụ sử dụng:**

- **Frontend**: 
  * React 18.x, Redux (State Management)
  * Bootstrap 4 (UI Framework)
  * Font Awesome (Icons)
  * Axios (HTTP Client)

- **Backend**: 
  * Node.js 18.x LTS
  * Express.js 4.x
  * Mongoose (MongoDB ODM)
  * Socket.IO (Real-time Communication)

- **Database**: 
  * MongoDB Atlas (Cloud Database)
  * Connection URI: `mongodb+srv://toantra349:***@ktpm.dwb8wtz.mongodb.net/mydb`

- **Authentication & Security**:
  * JWT (JSON Web Tokens)
  * bcrypt.js (Password Hashing)
  * CORS (Cross-Origin Resource Sharing)

- **Payment Integration**:
  * Stripe API (Thanh toán thẻ quốc tế)
  * PayPal REST SDK (Thanh toán PayPal)

- **Deployment**:
  * Backend: Railway (Cloud Platform)
  * Frontend: Vercel (đang triển khai)
  * Development: Docker & Docker Compose
  * Version Control: Git & GitHub

- **Testing Tools**:
  * Jest (Unit Testing)
  * React Testing Library (Component Testing)
  * Postman (API Testing)

**Giai đoạn Phát triển Hiện tại:**

Dự án hiện đang trong **giai đoạn kiểm thử và triển khai cuối cùng** trước khi đưa vào sử dụng chính thức. Các tính năng chính đã được phát triển hoàn chỉnh bao gồm:

- ✅ **Hoàn thành**: Hệ thống xác thực và phân quyền người dùng
- ✅ **Hoàn thành**: Quản lý sản phẩm và danh mục với tính năng tìm kiếm, lọc
- ✅ **Hoàn thành**: Giỏ hàng và quy trình đặt hàng
- ✅ **Hoàn thành**: Tích hợp thanh toán Stripe và PayPal
- ✅ **Hoàn thành**: Danh sách yêu thích (Wishlist/Favorite) - FR-021, FR-022, FR-023
- ✅ **Hoàn thành**: Hệ thống quản lý tồn kho với kiểm tra số lượng
- ✅ **Hoàn thành**: Hệ thống đánh giá và bình luận sản phẩm
- ✅ **Hoàn thành**: Admin dashboard với quản lý đơn hàng
- 🔄 **Đang kiểm thử**: Tính năng Sản phẩm liên quan (Related Products - FR-011)
- 🔄 **Đang triển khai**: CI/CD pipeline với GitHub Actions
- 🔄 **Đang triển khai**: Deployment lên Railway và Vercel

**Môi trường Kiểm thử:**

| Môi trường | Mô tả | Địa chỉ truy cập |
|------------|-------|------------------|
| **Development (Local)** | Môi trường phát triển cục bộ sử dụng Docker Compose | Client: http://localhost:3000<br>Server: http://localhost:8000 |
| **Staging (Railway)** | Môi trường kiểm thử trước khi production | Server: [Railway URL] |
| **Production** | Môi trường sản xuất chính thức | Client: [Vercel URL]<br>Server: [Railway URL] |

**Cơ sở Dữ liệu:**

Hệ thống sử dụng MongoDB Atlas với các collection chính:
- `users` - Thông tin người dùng và xác thực
- `products` - Danh mục sản phẩm thời trang
- `categories` - Phân loại sản phẩm
- `carts` - Giỏ hàng của người dùng
- `orders` - Đơn hàng
- `detail_orders` - Chi tiết đơn hàng
- `favorites` - Danh sách yêu thích
- `comments` - Đánh giá và bình luận
- `coupons` - Mã giảm giá
- `sales` - Chương trình khuyến mãi
- `payments` - Phương thức thanh toán
- `permissions` - Phân quyền người dùng
- **Production**: Railway (backend) + Vercel (frontend - dự kiến)

**Thông tin Cơ sở dữ liệu:**
- **Host**: ktpm.dwb8wtz.mongodb.net
- **Database**: mydb
- **User**: toantra349
- **Connection**: MongoDB Atlas với SSL/TLS

---

### 1.3. Phạm vi Kiểm thử (Scope of Testing)

Kế hoạch kiểm thử này bao phủ việc xác thực toàn diện tất cả các chức năng của hệ thống qua nhiều lớp và môi trường khác nhau.

#### **1.3.1. Nội dung Được Kiểm thử (In-Scope Testing)**

**A. Kiểm thử Yêu cầu Chức năng**

1. **Quản lý Người dùng (FR-001 đến FR-005)**
   - Đăng ký và đăng nhập người dùng
   - Mã hóa và xác thực mật khẩu
   - Quản lý hồ sơ cá nhân
   - Kiểm soát truy cập dựa trên vai trò (Admin, Nhân viên, Khách hàng)
   - Quản lý phiên làm việc và xác thực

2. **Quản lý Sản phẩm (FR-006 đến FR-012)**
   - Duyệt danh mục sản phẩm
   - Tìm kiếm và lọc sản phẩm
   - Điều hướng theo danh mục
   - Xem chi tiết sản phẩm
   - **Hiển thị Sản phẩm liên quan (FR-011)** ✓ Ưu tiên
   - Theo dõi tồn kho sản phẩm
   - Xác thực số lượng hàng có sẵn

3. **Giỏ hàng (FR-013 đến FR-016)**
   - Thêm/xóa sản phẩm khỏi giỏ hàng
   - Cập nhật số lượng
   - Lưu giữ giỏ hàng (người dùng đã đăng nhập)
   - Kiểm tra tồn kho trước khi thanh toán
   - Tính toán giá với giảm giá

4. **Danh sách Yêu thích (FR-021 đến FR-023)** ✓ Mới triển khai
   - Thêm sản phẩm vào danh sách yêu thích
   - Xóa khỏi danh sách yêu thích
   - Xem trang danh sách yêu thích
   - Icon wishlist trên header
   - Chuyển sản phẩm từ wishlist sang giỏ hàng

5. **Quản lý Đơn hàng (FR-017 đến FR-020)**
   - Quy trình thanh toán
   - Đặt hàng
   - Xem lịch sử đơn hàng
   - Theo dõi trạng thái đơn hàng
   - Quản lý địa chỉ giao hàng

6. **Xử lý Thanh toán**
   - Tích hợp thanh toán Stripe
   - Tích hợp thanh toán PayPal
   - Tùy chọn thanh toán khi nhận hàng
   - Xác nhận thanh toán
   - Bảo mật giao dịch

7. **Hệ thống Coupon & Khuyến mãi**
   - Xác thực mã coupon
   - Tính toán giảm giá
   - Hiển thị sale/khuyến mãi
   - Ưu đãi có thời hạn

8. **Dashboard Quản trị**
   - Các thao tác CRUD trên sản phẩm
   - Quản lý danh mục
   - Xử lý đơn hàng
   - Quản lý người dùng
   - Báo cáo tồn kho
   - Quản lý coupon

9. **Hệ thống Đánh giá & Bình luận**
   - Bình luận/đánh giá sản phẩm
   - Đánh giá sao (1-5)
   - Kiểm duyệt đánh giá

**B. Kiểm thử Yêu cầu Phi Chức năng**

1. **Kiểm thử Hiệu năng**
   - Thời gian tải trang (< 3 giây)
   - Thời gian phản hồi API (< 500ms)
   - Tối ưu hóa truy vấn database
   - Hiệu năng tải hình ảnh
   - Xử lý nhiều người dùng đồng thời

2. **Kiểm thử Bảo mật**
   - Phòng chống SQL Injection
   - Bảo vệ XSS (Cross-Site Scripting)
   - Bảo vệ CSRF
   - Xác thực authentication token
   - Mã hóa mật khẩu (bcrypt)
   - Áp dụng HTTPS
   - Mã hóa dữ liệu nhạy cảm

3. **Kiểm thử Khả năng Sử dụng**
   - Tính nhất quán giao diện người dùng
   - Tính trực quan của điều hướng
   - Khả năng đáp ứng mobile
   - Khả năng tiếp cận (WCAG guidelines)
   - Độ rõ ràng của thông báo lỗi

4. **Kiểm thử Tương thích**
   - Tương thích trình duyệt (Chrome, Firefox, Safari, Edge)
   - Kiểm thử thiết bị di động (iOS, Android)
   - Kiểm thử độ phân giải màn hình
   - Tương thích hệ điều hành

5. **Kiểm thử Độ tin cậy**
   - Giám sát uptime hệ thống
   - Cơ chế khôi phục lỗi
   - Sao lưu và khôi phục dữ liệu
   - Graceful degradation

**C. Kiểm thử Tích hợp**

1. **Tích hợp API**
   - Giao tiếp Frontend-Backend
   - Tích hợp API bên thứ ba (Stripe, PayPal)
   - Thao tác database
   - Upload/download file

2. **Tích hợp Module**
   - Luồng xác thực người dùng
   - Luồng từ giỏ hàng đến thanh toán
   - Luồng từ đơn hàng đến thanh toán
   - Thao tác Admin-to-database

**D. Kiểm thử Triển khai**

1. **Môi trường Docker**
   - Build container thành công
   - Điều phối Docker Compose
   - Mount volume
   - Kết nối mạng

2. **Triển khai Cloud**
   - Triển khai backend trên Railway
   - Cấu hình biến môi trường
   - Kết nối database (MongoDB Atlas)
   - Health check endpoints
   - Xử lý graceful shutdown

3. **CI/CD Pipeline**
   - Kiểm thử tự động khi push code
   - Xác thực quá trình build
   - Tự động hóa deployment

#### **1.3.2. Nội dung Không Kiểm thử (Out-of-Scope Testing)**

Các lĩnh vực sau **không** được bao phủ trong giai đoạn kiểm thử này:

1. **Load Testing** - Kiểm thử áp lực với hàng nghìn người dùng đồng thời (yêu cầu công cụ chuyên dụng như JMeter, K6)
2. **Penetration Testing** - Kiểm toán bảo mật nâng cao (yêu cầu đội ngũ bảo mật chuyên môn)
3. **Hỗ trợ Trình duyệt Cũ** - Internet Explorer 11 và các phiên bản cũ hơn
4. **Đa ngôn ngữ (i18n)** - Hỗ trợ nhiều ngôn ngữ (hiện chỉ có tiếng Việt)
5. **Admin Panel Bên thứ ba** - Kiểm thử dashboard PayPal/Stripe (ngoài tầm kiểm soát)
6. **Kiểm thử Hạ tầng** - Kiểm thử cấp độ nền tảng Railway/Vercel
7. **Kiểm thử Gửi Email** - Độ tin cậy SMTP server (sử dụng dịch vụ bên thứ ba)

#### **1.3.3. Các Cấp độ Kiểm thử**

1. **Unit Testing** - Các function và component riêng lẻ (Jest, React Testing Library)
2. **Integration Testing** - API endpoints và thao tác database
3. **System Testing** - Kịch bản người dùng end-to-end
4. **Acceptance Testing** - Xác thực tiêu chí chấp nhận của người dùng
5. **Regression Testing** - Xác minh chức năng hiện có sau khi thay đổi

#### **1.3.4. Ma trận Môi trường Kiểm thử**

| Môi trường | Frontend | Backend | Database | Mục đích |
|------------|----------|---------|----------|----------|
| **Local** | Docker (http://localhost:3000) | Docker (http://localhost:8000) | MongoDB Atlas | Development & Unit Testing |
| **Staging** | Vercel Preview | Railway Deploy | MongoDB Atlas (Test) | Integration & System Testing |
| **Production** | Vercel | Railway | MongoDB Atlas (Prod) | Acceptance & Smoke Testing |

#### **1.3.5. Phạm vi Dữ liệu Kiểm thử**

- **Sản phẩm Mẫu**: Ít nhất 20 sản phẩm trên 5 danh mục
- **Tài khoản Kiểm thử**: Tài khoản Admin, Nhân viên và Khách hàng
- **Kịch bản Đơn hàng**: Đơn hàng thành công, thanh toán thất bại, vấn đề tồn kho
- **Trường hợp Đặc biệt**: Giỏ hàng trống, sản phẩm hết hàng, coupon không hợp lệ
- **Dữ liệu Hiệu năng**: 100+ sản phẩm cho kiểm thử hiệu năng

#### **1.3.6. Tiêu chí Thành công**

Kiểm thử được coi là thành công khi:
- ✅ 100% các yêu cầu chức năng quan trọng đều pass
- ✅ 95%+ tất cả test cases đều pass
- ✅ Không còn bug mức độ nghiêm trọng cao chưa được giải quyết
- ✅ Các chỉ số hiệu năng đáp ứng ngưỡng đã định nghĩa
- ✅ Các lỗ hổng bảo mật được xử lý
- ✅ Triển khai trên Railway và Vercel ổn định
- ✅ Kiểm thử chấp nhận của người dùng được phê duyệt

---

## 2. TỪ ĐIỂN DỮ LIỆU (DATA DICTIONARY)

Phần này mô tả chi tiết cấu trúc dữ liệu của tất cả các collection trong cơ sở dữ liệu MongoDB Atlas được sử dụng trong hệ thống.

### 2.1. Collection: users (Người dùng)

**Mô tả**: Lưu trữ thông tin tài khoản người dùng của hệ thống, bao gồm khách hàng, nhân viên và quản trị viên.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất của người dùng | Khóa chính (Primary Key) |
| username | String | Tên đăng nhập | UNIQUE, NOT NULL, Min: 3 ký tự |
| password | String | Mật khẩu mã hóa của người dùng | NOT NULL, Hashed (bcrypt) |
| fullname | String | Họ tên đầy đủ người dùng | NOT NULL |
| email | String | Địa chỉ email đăng nhập | UNIQUE, NOT NULL, Email format |
| phone | String | Số điện thoại người dùng | Có thể NULL, 10 ký tự |
| address | String | Địa chỉ giao hàng mặc định | Có thể NULL |
| gender | String | Giới tính | Enum: ['Nam', 'Nữ', 'Khác'], Có thể NULL |
| avatar | String | URL ảnh đại diện | Có thể NULL |
| id_permission | ObjectId | Tham chiếu đến bảng permissions | Foreign Key → permissions._id, NOT NULL |
| createdAt | Date | Thời gian tạo tài khoản | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật cuối | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Unique: `username`, `email`
- Foreign Key: `id_permission` → `permissions._id`

---

### 2.2. Collection: permissions (Phân quyền)

**Mô tả**: Quản lý các vai trò và quyền hạn trong hệ thống.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| permission | String | Tên vai trò/quyền hạn | UNIQUE, NOT NULL, Enum: ['Admin', 'Nhân Viên', 'Khách Hàng'] |
| createdAt | Date | Thời gian tạo | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Unique: `permission`

---

### 2.3. Collection: categories (Danh mục sản phẩm)

**Mô tả**: Phân loại sản phẩm thời trang theo danh mục.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| category | String | Tên danh mục | UNIQUE, NOT NULL, VD: 'Áo', 'Quần', 'Giày' |
| slug | String | URL-friendly name | UNIQUE, Có thể NULL |
| description | String | Mô tả danh mục | Có thể NULL |
| image | String | Hình ảnh đại diện danh mục | Có thể NULL |
| createdAt | Date | Thời gian tạo | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Unique: `category`

---

### 2.4. Collection: products (Sản phẩm)

**Mô tả**: Lưu trữ thông tin chi tiết về các sản phẩm thời trang.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất sản phẩm | Khóa chính (Primary Key) |
| id_category | ObjectId | Tham chiếu đến danh mục | Foreign Key → categories._id, NOT NULL |
| name_product | String | Tên sản phẩm | NOT NULL, Min: 3 ký tự |
| price_product | Number | Giá bán sản phẩm (VNĐ) | NOT NULL, Min: 0 |
| number | Number | Số lượng tồn kho | NOT NULL, Default: 0, Min: 0 |
| image | String | URL hình ảnh chính | NOT NULL |
| images | Array[String] | Danh sách URL hình ảnh phụ | Có thể NULL |
| describe | String | Mô tả chi tiết sản phẩm | Có thể NULL |
| gender | String | Giới tính phù hợp | Enum: ['Nam', 'Nữ', 'Unisex'], NOT NULL |
| size | Array[String] | Các size có sẵn | VD: ['S', 'M', 'L', 'XL'], Có thể NULL |
| color | Array[String] | Các màu sắc có sẵn | Có thể NULL |
| material | String | Chất liệu sản phẩm | Có thể NULL |
| brand | String | Thương hiệu | Có thể NULL |
| view_count | Number | Số lượt xem | Default: 0, Min: 0 |
| sold_count | Number | Số lượng đã bán | Default: 0, Min: 0 |
| status | Boolean | Trạng thái hoạt động | Default: true |
| createdAt | Date | Thời gian tạo | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Foreign Key: `id_category` → `categories._id`
- Index: `name_product`, `price_product`, `gender`

---

### 2.5. Collection: sales (Chương trình khuyến mãi)

**Mô tả**: Quản lý các chương trình giảm giá cho sản phẩm.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| id_product | ObjectId | Tham chiếu đến sản phẩm | Foreign Key → products._id, NOT NULL |
| promotion | Number | Phần trăm giảm giá | NOT NULL, Min: 0, Max: 100 |
| sale | Number | Giá trị giảm (%) | NOT NULL, Min: 0, Max: 100 |
| describe | String | Mô tả chương trình | Có thể NULL |
| status | Boolean | Trạng thái hoạt động | Default: true |
| start | Date | Thời gian bắt đầu | NOT NULL |
| end | Date | Thời gian kết thúc | NOT NULL, Phải > start |
| createdAt | Date | Thời gian tạo | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Foreign Key: `id_product` → `products._id`
- Index: `start`, `end`, `status`

---

### 2.6. Collection: carts (Giỏ hàng)

**Mô tả**: Lưu trữ sản phẩm trong giỏ hàng của người dùng.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| id_user | ObjectId | Tham chiếu đến người dùng | Foreign Key → users._id, NOT NULL |
| id_product | ObjectId | Tham chiếu đến sản phẩm | Foreign Key → products._id, NOT NULL |
| name_product | String | Tên sản phẩm (snapshot) | NOT NULL |
| price_product | Number | Giá sản phẩm tại thời điểm thêm | NOT NULL, Min: 0 |
| count | Number | Số lượng sản phẩm | NOT NULL, Min: 1 |
| image | String | Hình ảnh sản phẩm | NOT NULL |
| size | String | Size đã chọn | Có thể NULL |
| color | String | Màu sắc đã chọn | Có thể NULL |
| createdAt | Date | Thời gian thêm vào giỏ | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Foreign Key: `id_user` → `users._id`, `id_product` → `products._id`
- Compound Index: `{id_user: 1, id_product: 1}`

---

### 2.7. Collection: favorites (Danh sách yêu thích)

**Mô tả**: Lưu trữ sản phẩm yêu thích của người dùng.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| id_user | ObjectId | Tham chiếu đến người dùng | Foreign Key → users._id, NOT NULL |
| id_product | ObjectId | Tham chiếu đến sản phẩm | Foreign Key → products._id, NOT NULL |
| createdAt | Date | Thời gian thêm yêu thích | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Foreign Key: `id_user` → `users._id`, `id_product` → `products._id`
- Unique Compound: `{id_user: 1, id_product: 1}` (Mỗi user chỉ yêu thích 1 sản phẩm 1 lần)

---

### 2.8. Collection: comments (Bình luận & Đánh giá)

**Mô tả**: Lưu trữ đánh giá và bình luận của khách hàng về sản phẩm.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| id_product | ObjectId | Tham chiếu đến sản phẩm | Foreign Key → products._id, NOT NULL |
| id_user | ObjectId | Tham chiếu đến người dùng | Foreign Key → users._id, NOT NULL |
| content | String | Nội dung bình luận | NOT NULL, Min: 1 ký tự |
| star | Number | Số sao đánh giá | NOT NULL, Min: 1, Max: 5 |
| status | String | Trạng thái kiểm duyệt | Enum: ['pending', 'approved', 'rejected'], Default: 'pending' |
| createdAt | Date | Thời gian bình luận | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Foreign Key: `id_product` → `products._id`, `id_user` → `users._id`
- Index: `id_product`, `star`, `status`

---

### 2.9. Collection: coupons (Mã giảm giá)

**Mô tả**: Quản lý mã giảm giá và voucher cho đơn hàng.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| code | String | Mã coupon | UNIQUE, NOT NULL, Uppercase |
| count | Number | Số lượng mã còn lại | NOT NULL, Min: 0 |
| promotion | String | Mô tả khuyến mãi | NOT NULL, VD: 'Giảm 20%' |
| describe | String | Điều kiện áp dụng | Có thể NULL |
| discount_type | String | Loại giảm giá | Enum: ['percentage', 'fixed'], Default: 'percentage' |
| discount_value | Number | Giá trị giảm | NOT NULL, Min: 0 |
| min_order_value | Number | Giá trị đơn hàng tối thiểu | Default: 0, Min: 0 |
| max_discount | Number | Giảm tối đa (VNĐ) | Có thể NULL, Min: 0 |
| start_date | Date | Ngày bắt đầu hiệu lực | NOT NULL |
| end_date | Date | Ngày hết hạn | NOT NULL, Phải > start_date |
| status | Boolean | Trạng thái hoạt động | Default: true |
| createdAt | Date | Thời gian tạo | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Unique: `code`
- Index: `status`, `start_date`, `end_date`

---

### 2.10. Collection: payments (Phương thức thanh toán)

**Mô tả**: Danh sách các phương thức thanh toán được hỗ trợ.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| pay_name | String | Tên phương thức thanh toán | UNIQUE, NOT NULL, VD: 'Stripe Payment', 'PayPal', 'COD' |
| description | String | Mô tả chi tiết | Có thể NULL |
| icon | String | URL icon phương thức | Có thể NULL |
| status | Boolean | Trạng thái hoạt động | Default: true |
| createdAt | Date | Thời gian tạo | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Unique: `pay_name`

---

### 2.11. Collection: notes (Ghi chú đơn hàng)

**Mô tả**: Thông tin người nhận và ghi chú cho đơn hàng.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| fullname | String | Họ tên người nhận | NOT NULL |
| phone | String | Số điện thoại người nhận | NOT NULL, 10 ký tự |
| email | String | Email người nhận | Có thể NULL, Email format |
| note | String | Ghi chú đặc biệt | Có thể NULL |
| createdAt | Date | Thời gian tạo | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`

---

### 2.12. Collection: deliveries (Thông tin vận chuyển)

**Mô tả**: Quản lý thông tin và chi phí vận chuyển.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| id_delivery | String | Mã vận đơn | UNIQUE, NOT NULL |
| from | String | Địa chỉ gửi hàng | NOT NULL |
| to | String | Địa chỉ nhận hàng | NOT NULL |
| distance | String | Khoảng cách vận chuyển | Có thể NULL, VD: '1700km' |
| duration | String | Thời gian giao hàng dự kiến | Có thể NULL, VD: '2 ngày' |
| price | Number | Chi phí vận chuyển (VNĐ) | NOT NULL, Min: 0 |
| status | String | Trạng thái vận chuyển | Enum: ['pending', 'shipping', 'delivered'], Default: 'pending' |
| createdAt | Date | Thời gian tạo | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Unique: `id_delivery`

---

### 2.13. Collection: orders (Đơn hàng)

**Mô tả**: Lưu trữ thông tin tổng quan về đơn hàng.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất đơn hàng | Khóa chính (Primary Key) |
| id_user | ObjectId | Tham chiếu đến người đặt hàng | Foreign Key → users._id, NOT NULL |
| id_payment | ObjectId | Tham chiếu đến phương thức thanh toán | Foreign Key → payments._id, NOT NULL |
| id_note | ObjectId | Tham chiếu đến ghi chú | Foreign Key → notes._id, Có thể NULL |
| id_coupon | ObjectId | Tham chiếu đến mã giảm giá | Foreign Key → coupons._id, Có thể NULL |
| address | String | Địa chỉ giao hàng | NOT NULL |
| total | Number | Tổng giá trị đơn hàng (VNĐ) | NOT NULL, Min: 0 |
| feeship | Number | Phí vận chuyển (VNĐ) | NOT NULL, Default: 0, Min: 0 |
| discount | Number | Số tiền được giảm giá (VNĐ) | Default: 0, Min: 0 |
| final_total | Number | Tổng cuối cùng (total + feeship - discount) | NOT NULL, Min: 0 |
| status | String | Trạng thái đơn hàng | Enum: ['Chờ xử lý', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'], Default: 'Chờ xử lý' |
| pay | Boolean | Trạng thái thanh toán | Default: false |
| create_time | String | Thời gian đặt hàng (ISO String) | NOT NULL |
| payment_time | Date | Thời gian thanh toán | Có thể NULL |
| delivery_time | Date | Thời gian giao hàng | Có thể NULL |
| createdAt | Date | Thời gian tạo | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Foreign Keys: `id_user` → `users._id`, `id_payment` → `payments._id`, `id_note` → `notes._id`, `id_coupon` → `coupons._id`
- Index: `status`, `pay`, `create_time`

---

### 2.14. Collection: detail_orders (Chi tiết đơn hàng)

**Mô tả**: Lưu trữ chi tiết từng sản phẩm trong đơn hàng.

| Tên trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|------------|--------------|-------|-----------|
| _id | ObjectId | Mã định danh duy nhất | Khóa chính (Primary Key) |
| id_order | ObjectId | Tham chiếu đến đơn hàng | Foreign Key → orders._id, NOT NULL |
| id_product | ObjectId | Tham chiếu đến sản phẩm | Foreign Key → products._id, NOT NULL |
| name_product | String | Tên sản phẩm (snapshot) | NOT NULL |
| price_product | Number | Giá sản phẩm tại thời điểm mua | NOT NULL, Min: 0 |
| count | Number | Số lượng mua | NOT NULL, Min: 1 |
| size | String | Size đã chọn | Có thể NULL |
| color | String | Màu sắc đã chọn | Có thể NULL |
| image | String | Hình ảnh sản phẩm | NOT NULL |
| subtotal | Number | Tổng tiền (price_product × count) | NOT NULL, Min: 0 |
| createdAt | Date | Thời gian tạo | Tự động, NOT NULL |
| updatedAt | Date | Thời gian cập nhật | Tự động, NOT NULL |

**Indexes**:
- Primary: `_id`
- Foreign Keys: `id_order` → `orders._id`, `id_product` → `products._id`
- Index: `id_order`

---

### 2.15. Mối quan hệ giữa các Collection

**Sơ đồ quan hệ:**

```
users (1) ----< (n) carts
users (1) ----< (n) favorites
users (1) ----< (n) orders
users (1) ----< (n) comments
users (n) ----< (1) permissions

categories (1) ----< (n) products

products (1) ----< (n) carts
products (1) ----< (n) favorites
products (1) ----< (n) comments
products (1) ----< (1) sales
products (1) ----< (n) detail_orders

orders (1) ----< (n) detail_orders
orders (n) ----< (1) payments
orders (n) ----< (1) notes
orders (n) ----< (1) coupons (optional)
```

**Ghi chú:**
- Tất cả collection đều sử dụng `_id` kiểu ObjectId làm khóa chính
- Mối quan hệ được thực hiện thông qua tham chiếu ObjectId
- Mongoose tự động tạo `createdAt` và `updatedAt` khi sử dụng timestamps
- Các trường có ràng buộc UNIQUE được đánh index tự động
- Foreign Key được populate khi query để lấy dữ liệu liên kết
- ✅ Không còn bug mức độ nghiêm trọng cao chưa được giải quyết
- ✅ Các chỉ số hiệu năng đáp ứng ngưỡng đã định nghĩa
- ✅ Các lỗ hổng bảo mật được xử lý
- ✅ Triển khai trên Railway và Vercel ổn định
- ✅ Kiểm thử chấp nhận của người dùng được phê duyệt

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 9, 2025 | QA Team | Initial document creation |

---

**Next Sections:**
- Section 2: Test Strategy
- Section 3: Test Cases
- Section 4: Test Execution
- Section 5: Defect Management
- Section 6: Test Reports
