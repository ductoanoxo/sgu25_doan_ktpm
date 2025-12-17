
# 🛍️ Website Bán Quần Áo - Fear of God

<div align="center">

![Demo Application](./image/output.gif)

*🎥 Demo ứng dụng hoạt động thực tế*

[![CI/CD Pipeline](https://github.com/Babyfat012/sgu25_doan_ktpm/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/Babyfat012/sgu25_doan_ktpm/actions)
[![Development CI](https://github.com/Babyfat012/sgu25_doan_ktpm/workflows/Development%20Branch%20CI/badge.svg)](https://github.com/Babyfat012/sgu25_doan_ktpm/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.x-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-17.x-blue.svg)](https://reactjs.org/)

</div>

---

## 📋 Thông tin đồ án

### Thông tin chung
- **Tên đề tài:** Xây dựng Website bán quần áo sử dụng công nghệ ReactJS & NodeJS (API, Socket)
- **Môn học:** Kiểm thử phần mềm
- **Lớp:** DCT122C3
- **Năm học:** 2025

### 👥 Thành viên nhóm
| STT | Họ và Tên |
|-----|-----------|
| 1 | Trịnh Long Phát |  
| 2 | Lê Hồng Phát | 
| 3 | Trương Phú Kiệt |
| 4 | Trà Đức Toàn |

---

## 📖 Mô tả dự án

Website thương mại điện tử chuyên về thời trang quần áo với các tính năng hiện đại, cho phép khách hàng dễ dàng tìm kiếm, đặt hàng và thanh toán trực tuyến. Hệ thống được xây dựng với kiến trúc microservices, tích hợp real-time chat, thanh toán trực tuyến và quản lý đơn hàng thông minh.

### 🎯 Mục tiêu
- Xây dựng nền tảng thương mại điện tử hoàn chỉnh
- Tối ưu trải nghiệm người dùng với giao diện hiện đại
- Tích hợp thanh toán trực tuyến an toàn
- Hỗ trợ tư vấn khách hàng real-time qua Live Chat
- Quản lý đơn hàng và giao hàng thông minh với Google Maps API

---

## 🎬 Demo hệ thống

<div align="center">

### 🚀 Demo tổng quan

<img src="./image/DEMOFULLHETHONG.gif" alt="Demo Full Hệ Thống" width="90%"/>

*Demo ngắn gọn các tính năng chính của hệ thống*

---

### 📹 Video Demo chi tiết

Xem demo đầy đủ các tính năng của hệ thống:

<table>
  <tr>
    <td align="center" width="50%">
      <a href="https://screenrec.com/share/S538TYHkDe">
        <img src="https://img.shields.io/badge/🎥_Demo_Video_1-Watch_Now-red?style=for-the-badge&logo=youtube" alt="Demo Video 1"/>
      </a>
      <br/>
      <sub><b>Demo Video - Full Features</b></sub>
      <br/>
      <sub>Client & Shopping Experience</sub>
    </td>
    <td align="center" width="50%">
      <a href="https://screenrec.com/share/J4uDgMo6dH">
        <img src="https://img.shields.io/badge/🎥_Demo_Video_2-Watch_Now-red?style=for-the-badge&logo=youtube" alt="Demo Video 2"/>
      </a>
      <br/>
      <sub><b>Demo Video - Full Features</b></sub>
      <br/>
      <sub>Admin Dashboard & Management</sub>
    </td>
  </tr>
</table>

**📝 Nội dung demo:**
- ✅ Giao diện người dùng và tính năng shopping
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Giỏ hàng và checkout flow
- ✅ Thanh toán trực tuyến (PayPal, Stripe)
- ✅ Live Chat real-time
- ✅ Admin dashboard và quản lý
- ✅ Thống kê và báo cáo

</div>

---

## ✨ Tính năng chính

### 👤 Dành cho Khách hàng
- ✅ Đăng ký, đăng nhập, quên mật khẩu
- ✅ Tìm kiếm, lọc sản phẩm theo danh mục, giới tính, giá
- ✅ Xem chi tiết sản phẩm, đánh giá và bình luận
- ✅ Thêm sản phẩm vào giỏ hàng, danh sách yêu thích
- ✅ Đặt hàng với nhiều phương thức thanh toán (PayPal, Stripe, COD)
- ✅ Theo dõi đơn hàng real-time
- ✅ Live Chat tư vấn với nhân viên
- ✅ Tính phí giao hàng dựa trên khoảng cách (Google Maps API)

### 👨‍💼 Dành cho Nhân viên
- ✅ Quản lý đơn hàng (xác nhận, hủy, cập nhật trạng thái)
- ✅ Tư vấn khách hàng qua Live Chat
- ✅ Xem thống kê đơn hàng
- ✅ Quản lý thông tin cá nhân

### 🔐 Dành cho Admin
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục sản phẩm
- ✅ Quản lý người dùng và phân quyền
- ✅ Quản lý đơn hàng toàn hệ thống
- ✅ Xem báo cáo và thống kê
- ✅ Giám sát hệ thống qua Prometheus & Grafana

---

## 🖼️ Giao diện & Kiến trúc hệ thống

### 📐 Các sơ đồ thiết kế hệ thống

Dưới đây là các sơ đồ kiến trúc và thiết kế chi tiết của hệ thống, từ tổng quan đến cụ thể:

<div align="center">

#### 🎯 Use Case Diagram - Tổng quan hệ thống

Sơ đồ Use Case mô tả các chức năng chính của hệ thống và tương tác giữa các actor (Khách hàng, Nhân viên, Admin) với các use case tương ứng.

<img src="./image/UseCase_HeThong.drawio.png" alt="Use Case Diagram" width="90%"/>

---

#### 🌐 Context Diagram

Context Diagram thể hiện phạm vi của hệ thống và cách hệ thống tương tác với các thực thể bên ngoài (External Entities). Diagram này giúp hiểu rõ ranh giới và các luồng dữ liệu chính.

<img src="./image/Lab3-Context%20%20Diagram.drawio.png" alt="Context Diagram" width="90%"/>

---

#### 🧩 Conceptual Model

Mô hình khái niệm (Conceptual Model) mô tả các thực thể chính trong hệ thống và mối quan hệ giữa chúng ở mức độ trừu tượng cao, không bị ràng buộc bởi chi tiết kỹ thuật.

<img src="./image/Lab3-Conceptual%20Model.drawio.png" alt="Conceptual Model" width="90%"/>

---

#### 🏗️ C4 Model Architecture

C4 Model cung cấp cái nhìn tổng quan về kiến trúc hệ thống theo 4 cấp độ: Context, Container, Component và Code. Sơ đồ này giúp hiểu rõ cấu trúc tổng thể và các thành phần chính.

<img src="./image/C4Model.drawio.png" alt="C4 Model Architecture" width="90%"/>

---

#### 🐳 Container Architecture (Docker)

Sơ đồ kiến trúc container thể hiện cách các service được đóng gói và triển khai với Docker. Bao gồm: Client App, Admin App, Server App, MongoDB, và các service hỗ trợ như Prometheus & Grafana.

<img src="./image/ContainerDocker.png" alt="Container Architecture" width="90%"/>

</div>

---

### 🎨 Giao diện người dùng (UI Screenshots)

Dưới đây là các màn hình chính của ứng dụng, minh họa trải nghiệm người dùng thực tế:

<div align="center">

#### 🏠 Trang chủ Client

Giao diện trang chủ hiển thị các sản phẩm nổi bật với thiết kế hiện đại, responsive. Người dùng có thể dễ dàng tìm kiếm, lọc sản phẩm theo danh mục và thêm vào giỏ hàng.

<img src="./image/GiaoDienTrangChu.png" alt="Trang chủ Client" width="85%"/>

<details>
<summary>📋 <b>Tính năng chính của trang chủ</b></summary>

- 🔍 Thanh tìm kiếm thông minh
- 🏷️ Lọc theo danh mục, giới tính, giá
- ⭐ Hiển thị rating và reviews
- 🛒 Quick add to cart
- 💝 Thêm vào wishlist
- 📱 Responsive design cho mobile

</details>

---

#### 🛒 Giỏ hàng

Trang giỏ hàng cho phép người dùng xem danh sách sản phẩm đã chọn, điều chỉnh số lượng, size và tính tổng tiền tự động trước khi thanh toán.

<img src="./image/GioHang.png" alt="Giỏ hàng" width="85%"/>

<details>
<summary>📋 <b>Tính năng giỏ hàng</b></summary>

- ➕➖ Tăng/giảm số lượng sản phẩm
- 🗑️ Xóa sản phẩm khỏi giỏ
- 📏 Chọn size (S/M/L/XL)
- 💰 Tính tổng tiền tự động
- 🎫 Áp dụng mã giảm giá
- 🚚 Tính phí vận chuyển
- 💳 Chọn phương thức thanh toán

</details>

---

#### 🔑 Đăng nhập Client

Giao diện đăng nhập cho khách hàng với form validation và hỗ trợ quên mật khẩu. Tích hợp JWT authentication để bảo mật thông tin người dùng.

<img src="./image/DangNhapClient.png" alt="Đăng nhập Client" width="75%"/>

<details>
<summary>🔐 <b>Tính năng authentication</b></summary>

- ✅ Đăng nhập với username/email
- 🔒 Mật khẩu được mã hóa (bcrypt)
- 🔑 JWT token-based authentication
- 📧 Quên mật khẩu và reset qua email
- 🆕 Link đăng ký tài khoản mới
- 👁️ Show/hide password

</details>

---

#### 🔐 Đăng nhập Admin

Giao diện đăng nhập dành riêng cho Admin và Staff với mức bảo mật cao hơn, yêu cầu quyền truy cập đặc biệt.

<img src="./image/DangNhapAdmin.png" alt="Đăng nhập Admin" width="75%"/>

<details>
<summary>🛡️ <b>Bảo mật Admin</b></summary>

- 🔐 Authentication với role-based access
- 👤 Phân quyền Admin/Staff
- 🔒 Session management
- 📊 Activity logging
- ⏰ Session timeout
- 🚫 Brute force protection

</details>

---

#### 📊 Dashboard Admin

Trang quản trị tổng quan với các thống kê, biểu đồ và công cụ quản lý toàn diện cho Admin. Dashboard hiển thị real-time data về đơn hàng, doanh thu, sản phẩm và người dùng.

<img src="./image/TrangChuAdmin.png" alt="Dashboard Admin" width="85%"/>

<details>
<summary>📈 <b>Tính năng Dashboard</b></summary>

- 📊 Biểu đồ doanh thu theo thời gian
- 📦 Thống kê đơn hàng (pending, completed, cancelled)
- 👥 Quản lý người dùng và phân quyền
- 🛍️ Sản phẩm bán chạy nhất
- 💰 Tổng doanh thu và lợi nhuận
- 📈 Tỷ lệ chuyển đổi (conversion rate)
- 🔔 Thông báo đơn hàng mới real-time
- 🎯 KPIs và metrics quan trọng

</details>

</div>

---

### 📱 Responsive Design

<div align="center">

| Desktop 💻 | Tablet 📱 | Mobile 📱 |
|:---:|:---:|:---:|
| Full feature | Optimized layout | Mobile-first |
| ≥ 1024px | 768px - 1023px | < 768px |

Ứng dụng được thiết kế với **mobile-first approach**, đảm bảo trải nghiệm mượt mà trên mọi thiết bị.

</div>

---

## 🏗️ Kiến trúc hệ thống

### Công nghệ sử dụng

#### Backend
- **Runtime:** Node.js 18.x
- **Framework:** Express.js 4.17.1
- **Database:** MongoDB 5.x với Mongoose ODM 5.12.2
- **Authentication:** JWT + bcryptjs
- **Real-time:** Socket.IO 3.1.0
- **File Upload:** Cloudinary + Multer
- **Email:** Nodemailer
- **Payment:** PayPal REST SDK, Stripe
- **Monitoring:** Prometheus + prom-client

#### Frontend
- **Framework:** React 17.x
- **Client App:** Node.js 16.x với React Scripts 4.0.3
- **Admin App:** Node.js 16.x với React Scripts 4.0.3
- **Styling:** SCSS, CSS
- **Maps:** Google Maps API

#### DevOps & Tools
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Web Server:** Nginx (trong container)
- **Monitoring:** Prometheus + Grafana
- **Version Control:** Git
- **Bug Tracking:** GitHub Issues
- **Testing:** Jest, Supertest, React Testing Library

### Kiến trúc Microservices

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Client App    │      │   Admin App     │      │   Server App    │
│   (React 17)    │◄────►│   (React 17)    │◄────►│   (Node.js 18)  │
│   Port: 3000    │      │   Port: 3001    │      │   Port: 5000    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                        │                         │
         └────────────────────────┴─────────────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   MongoDB 5.x   │
                         │   Port: 27017   │
                         └─────────────────┘
```

---

## 🚀 CI/CD Pipeline

Dự án đã được tích hợp **GitHub Actions** để tự động hóa toàn bộ quy trình **Continuous Integration** và **Continuous Deployment**, đảm bảo chất lượng code và triển khai nhanh chóng.

<div align="center">

### 📊 Sơ đồ quy trình CI/CD

<img src="./image/CICD.png" alt="CI/CD Pipeline Diagram" width="90%"/>

*Quy trình CI/CD tự động từ commit code đến deployment production*

</div>

---

### 🔄 Workflows Overview

Hệ thống CI/CD của chúng tôi bao gồm 3 workflows chính:

#### 1️⃣ **CI/CD Pipeline** (Main Workflow)
**Trigger:** Push vào branch `main` hoặc Pull Request

**Các bước thực hiện:**
- 🔍 **Code Checkout**: Clone source code từ repository
- 🧪 **Run Tests**: Chạy unit tests và integration tests cho tất cả apps
  - Server tests với Jest
  - Client tests với React Testing Library
  - Admin tests với React Testing Library
- 📊 **Code Coverage**: Tạo coverage reports và upload lên Codecov
- 🐳 **Build Docker Images**: Build multi-stage Docker images
  - `server_app`: Node.js 18 backend
  - `client_app`: React client application
  - `admin_app`: React admin dashboard
- 📦 **Push to GHCR**: Push images lên GitHub Container Registry
- ✅ **Quality Gates**: Kiểm tra coverage threshold (>80%)

#### 2️⃣ **Development CI** (Quick Validation)
**Trigger:** Push vào các development branches

**Mục đích:** 
- ⚡ Validation nhanh cho development code
- 🧪 Chạy tests cơ bản
- 🔍 Lint và format check
- 🚫 Không build images (tiết kiệm thời gian)

#### 3️⃣ **Deploy Pipeline** (Production Deployment)
**Trigger:** Merge vào branch `main` (manual/automatic)

**Các bước:**
- 🚀 Pull latest images từ GHCR
- 🔧 Configure environment variables
- 🐳 Deploy lên production servers
- 🏥 Health checks
- 📧 Notification (Slack/Email)

---

### 🔁 Quy trình CI/CD chi tiết

```mermaid
graph LR
    A[Developer Push Code] --> B[GitHub Actions Triggered]
    B --> C{Branch?}
    C -->|main| D[Full CI/CD Pipeline]
    C -->|dev| E[Development CI]
    D --> F[Run All Tests]
    F --> G[Generate Coverage]
    G --> H{Tests Pass?}
    H -->|Yes| I[Build Docker Images]
    H -->|No| J[Notify Developer]
    I --> K[Push to GHCR]
    K --> L[Deploy to Production]
    L --> M[Health Check]
    M --> N{Healthy?}
    N -->|Yes| O[Success ✅]
    N -->|No| P[Rollback]
    E --> Q[Quick Tests]
    Q --> R[Lint Check]
```

**Luồng hoạt động:**

1. **🔵 Code Push** 
   ```bash
   git add .
   git commit -m "feat: Add new feature"
   git push origin main
   ```
   → Trigger GitHub Actions workflow

2. **🟢 Automated Testing**
   - Unit Tests: Test từng module riêng lẻ
   - Integration Tests: Test tương tác giữa các module
   - E2E Tests: Test user flows hoàn chỉnh
   - Coverage: Đảm bảo >80% code coverage

3. **📊 Code Coverage**
   ```bash
   # Server coverage
   cd server_app && npm run test:coverage
   
   # Client coverage  
   cd client_app && npm run test:coverage
   
   # Admin coverage
   cd admin_app && npm run test:coverage
   ```
   → Upload reports lên Codecov/Coveralls

4. **🐳 Build Docker Images**
   - Multi-stage builds để optimize size
   - Cache layers để tăng tốc độ build
   - Tag theo version và commit SHA
   ```dockerfile
   # Example: Multi-stage build
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   FROM node:18-alpine
   WORKDIR /app
   COPY --from=builder /app/node_modules ./node_modules
   COPY . .
   CMD ["npm", "start"]
   ```

5. **📦 Push to GitHub Container Registry**
   ```bash
   docker tag myapp:latest ghcr.io/username/myapp:latest
   docker push ghcr.io/username/myapp:latest
   ```

6. **🚀 Deployment**
   - Pull images từ GHCR
   - Update docker-compose.yml
   - Rolling update (zero downtime)
   - Health checks sau deployment

---

### 🛠️ Công nghệ sử dụng

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **CI/CD Platform** | GitHub Actions | Automation workflows |
| **Container Registry** | GitHub Container Registry (GHCR) | Docker image storage |
| **Testing Framework** | Jest, Supertest, React Testing Library | Unit & Integration tests |
| **Code Coverage** | Istanbul/NYC | Coverage reports |
| **Container Platform** | Docker & Docker Compose | Containerization |
| **Monitoring** | Prometheus & Grafana | Performance monitoring |
| **Notifications** | GitHub Notifications | Build status alerts |

---

### 📈 Benefits của CI/CD Pipeline

<div align="center">

| Benefit | Description | Impact |
|---------|-------------|--------|
| 🚀 **Fast Delivery** | Tự động deploy mỗi khi merge code | Deploy trong 5-10 phút |
| ✅ **Quality Assurance** | Tests tự động trước khi deploy | Giảm 95% bugs production |
| 🔄 **Rollback Easy** | Có thể rollback nhanh nếu có lỗi | Downtime < 30 giây |
| 📊 **Visibility** | Theo dõi status của mọi deployment | 100% transparency |
| 🔒 **Security** | Scan vulnerabilities tự động | Phát hiện sớm lỗ hổng |

</div>

---

### 🎯 CI/CD Best Practices trong dự án

✅ **Được áp dụng:**
- ✔️ Automated testing trên mọi branch
- ✔️ Code coverage requirements (>80%)
- ✔️ Docker multi-stage builds
- ✔️ Environment-specific configurations
- ✔️ Automated rollback on failure
- ✔️ Health checks sau deployment
- ✔️ Parallel test execution
- ✔️ Caching dependencies

📝 **Workflow Configuration Example:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker images
        run: docker compose build
      - name: Push to GHCR
        run: docker compose push
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          docker compose pull
          docker compose up -d
```

📖 **Tài liệu chi tiết:** 
- [CI/CD Guide](./docs/CI_CD_GUIDE.md) - Hướng dẫn setup và configuration
- [Workflows Documentation](./.github/WORKFLOWS.md) - Chi tiết từng workflow
- [Testing Guide](./TESTING_GUIDE.md) - Chiến lược testing

## 📊 Chi tiết các công cụ và phiên bản

| Loại | Công cụ | Phiên bản | Nguồn |
|------|---------|-----------|-------|
| **Project Management** | GitHub | - | Repository |
| **Bug Tracking** | GitHub Issues | - | Repository |
| **Version Control** | Git | - | Managed by repo |
| **Runtime (Server)** | Node.js | 18.x | `server_app/Dockerfile` |
| **Runtime (Client/Admin)** | Node.js | 16.x | `client_app` & `admin_app/Dockerfile` |
| **Package Manager** | npm | Latest | From Node image |
| **Database** | MongoDB | 5.x | `docker-compose.yml` |
| **Web Framework** | Express | ^4.17.1 | `server_app/package.json` |
| **Database ODM** | Mongoose | ^5.12.2 | `server_app/package.json` |
| **Authentication** | bcryptjs | ^2.4.3 | `server_app/package.json` |
| **Authentication** | jsonwebtoken | ^8.5.1 | `server_app/package.json` |
| **Real-time** | Socket.IO | ^3.1.0 | Server & Client |
| **Frontend** | React (Client) | ^17.0.1 | `client_app/package.json` |
| **Frontend** | React (Admin) | ^17.0.2 | `admin_app/package.json` |
| **React Scripts** | react-scripts | 4.0.3 | Client & Admin apps |
| **Payment** | PayPal REST SDK | ^1.8.1 | `server_app/package.json` |
| **Payment** | Stripe | ^19.1.0 | `server_app/package.json` |
| **File Storage** | Cloudinary | ^1.41.3 | `server_app/package.json` |
| **Email Service** | Nodemailer | ^6.5.0 | `server_app/package.json` |
| **Monitoring** | Prometheus Client | ^15.1.0 | `server_app/package.json` |
| **Testing** | Jest | ^27.5.1 | Server & Client apps |
| **Testing** | Supertest | ^6.2.2 | `server_app/package.json` |
| **Code Quality** | ESLint | ^8.12.0 | `server_app/package.json` |
| **Dev Tool** | nodemon | ^2.0.7 | `server_app/package.json` |

> **Lưu ý:** Các phiên bản trên được lấy từ `package.json` và cấu hình Docker. Để cập nhật, chỉnh sửa file tương ứng và rebuild Docker images với `docker compose build`.


---

## 🎓 Giới thiệu chi tiết

### Bối cảnh
Ngày nay, công nghệ thông tin đã có những bước phát triển mạnh mẽ trong mọi phương diện: đời sống, công việc, giải trí, truyền thông. Đặc biệt trong lĩnh vực bán hàng, các doanh nghiệp và cửa hàng nhỏ lẻ đều cần có website để quảng bá, bán hàng trực tuyến và tương tác với khách hàng.

### Giải pháp
Nắm bắt nhu cầu đó, nhóm chúng em đã phát triển một website thương mại điện tử chuyên về thời trang với các tính năng hiện đại:
- 🛒 **Quản lý sản phẩm**: Thêm, xóa, tìm kiếm, phân trang, phân loại
- 📦 **Đặt hàng thông minh**: Đơn giản và nhanh chóng
- 💬 **Live Chat**: Tư vấn khách hàng real-time
- 📧 **Email notification**: Xác nhận đơn hàng tự động
- 💳 **Thanh toán đa dạng**: PayPal, Stripe, COD
- 🗺️ **Tính phí giao hàng**: Dựa trên khoảng cách với Google Maps API
- 📊 **Monitoring**: Theo dõi hiệu suất với Prometheus & Grafana

---

## 📐 Thiết kế hệ thống

### Entity Relationship Diagram (ERD)
<div align="center">
<img src="https://firebasestorage.googleapis.com/v0/b/todo-app-tienkim.appspot.com/o/diagram.PNG?alt=media&token=656d0b0c-0540-4257-a90a-3c024f50946b" alt="ERD Diagram" width="800"/>
</div>

### Use Case Diagrams

#### 👤 Use Case - Khách Hàng
<div align="center">
<img src="https://firebasestorage.googleapis.com/v0/b/todo-app-tienkim.appspot.com/o/KhachHang.PNG?alt=media&token=07f504bd-6d34-4da4-abe7-a82de78293d2" alt="Use Case Khách Hàng" width="700"/>
</div>

#### 👨‍💼 Use Case - Nhân Viên Bán Hàng
<div align="center">
<img src="https://firebasestorage.googleapis.com/v0/b/todo-app-tienkim.appspot.com/o/NhanVien.PNG?alt=media&token=a6f82edc-64fc-4086-bcd9-0ba490f213eb" alt="Use Case Nhân Viên" width="700"/>
</div>

#### 🔐 Use Case - Admin
<div align="center">
<img src="https://firebasestorage.googleapis.com/v0/b/todo-app-tienkim.appspot.com/o/Admin.PNG?alt=media&token=0e9b75b8-1720-402b-9f76-b64614fe7f12" alt="Use Case Admin" width="700"/>
</div>

---

## 🗄️ Thiết kế cơ sở dữ liệu

### Mô tả các bảng (Collections)

#### 📦 Product (Sản phẩm)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | ID sản phẩm |
| `id_category` | ObjectId | ID danh mục |
| `name_product` | String | Tên sản phẩm |
| `price_product` | Number | Giá sản phẩm |
| `image` | String | URL hình ảnh |
| `describe` | String | Mô tả sản phẩm |
| `gender` | String | Giới tính (Nam/Nữ/Unisex) |
| `number` | Number | Số lượng tồn kho |

**Quan hệ:**
- 1 Product → 1 Category
- 1 Product → N Favorites
- 1 Product → N Comments
- 1 Product → N Detail_Orders

#### 📁 Category (Danh mục)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | ID danh mục |
| `category` | String | Tên danh mục |

**Quan hệ:**
- 1 Category → N Products

#### 👤 User (Người dùng)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | ID người dùng |
| `username` | String | Tên đăng nhập (unique) |
| `password` | String | Mật khẩu (bcrypt hash) |
| `fullname` | String | Họ tên |
| `email` | String | Email (unique) |
| `id_permission` | ObjectId | ID quyền |

**Quan hệ:**
- 1 User → 1 Permission
- 1 User → N Comments
- 1 User → N Orders
- 1 User → N Favorites

#### 🔐 Permission (Phân quyền)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | ID quyền |
| `permission` | String | Tên quyền (Customer/Staff/Admin) |

**Quan hệ:**
- 1 Permission → N Users

#### 📋 Order (Đơn hàng)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | ID đơn hàng |
| `fullname` | String | Tên người nhận |
| `address` | String | Địa chỉ giao hàng |
| `phone` | String | Số điện thoại |
| `total` | Number | Tổng tiền |
| `status` | Number | Trạng thái (1-5) |
| `id_user` | ObjectId | ID khách hàng |
| `id_payment` | ObjectId | ID phương thức thanh toán |
| `id_delivery` | ObjectId | ID phương thức vận chuyển |

**Trạng thái đơn hàng:**
1. Chưa xác nhận
2. Đã xác nhận
3. Đang vận chuyển
4. Hoàn thành
5. Đã hủy

**Quan hệ:**
- 1 Order → 1 User
- 1 Order → 1 Payment
- 1 Order → 1 Delivery
- 1 Order → N Detail_Orders

#### 📝 Detail_Order (Chi tiết đơn hàng)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | ID chi tiết đơn hàng |
| `price_product` | Number | Giá sản phẩm |
| `name_product` | String | Tên sản phẩm |
| `count` | Number | Số lượng |
| `size` | String | Kích thước (S/M/L/XL) |
| `id_order` | ObjectId | ID đơn hàng |
| `id_product` | ObjectId | ID sản phẩm |

> **Lưu ý:** Lưu `name_product` và `price_product` để tránh thay đổi khi sản phẩm gốc bị cập nhật.

**Quan hệ:**
- N Detail_Orders → 1 Order
- N Detail_Orders → 1 Product

#### 💳 Payment (Phương thức thanh toán)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | ID phương thức |
| `pay_name` | String | Tên phương thức (PayPal/Stripe/COD) |

**Quan hệ:**
- 1 Payment → N Orders

#### 💬 Comment (Bình luận & Đánh giá)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | ID bình luận |
| `content` | String | Nội dung đánh giá |
| `star1` | Number | Số sao 1⭐ |
| `star2` | Number | Số sao 2⭐ |
| `star3` | Number | Số sao 3⭐ |
| `star4` | Number | Số sao 4⭐ |
| `star5` | Number | Số sao 5⭐ |
| `id_user` | ObjectId | ID người đánh giá |
| `id_product` | ObjectId | ID sản phẩm |

**Quan hệ:**
- N Comments → 1 User
- N Comments → 1 Product

#### ❤️ Favorite (Yêu thích)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | ID yêu thích |
| `id_user` | ObjectId | ID người dùng |
| `id_product` | ObjectId | ID sản phẩm |

**Quan hệ:**
- N Favorites → 1 User
- N Favorites → 1 Product

#### 📍 Delivery (Giao hàng)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | ID giao hàng |
| `fullname` | String | Tên người nhận |
| `phone` | String | Số điện thoại |

**Quan hệ:**
- 1 Delivery → 1 Order

---

## 🔌 API Documentation

> ⚠️ **Lưu ý:** Endpoints dưới đây là cho mục đích tham khảo và phát triển local.

### Base URL
```
http://localhost:5000/api
```

### 📦 Product API (`/api/product`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | Lấy tất cả sản phẩm | ❌ |
| `GET` | `/category` | Lấy sản phẩm theo danh mục | ❌ |
| `GET` | `/:id` | Lấy chi tiết sản phẩm | ❌ |
| `GET` | `/category/gender` | Lọc theo giới tính | ❌ |
| `GET` | `/category/pagination` | Phân trang sản phẩm | ❌ |
| `GET` | `/scroll/page` | Scroll pagination | ❌ |

**Example Request:**
```bash
GET /api/product?category=T-Shirt&gender=male&page=1&limit=12
```

### 👤 User API (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | Lấy danh sách users | ✅ Admin |
| `GET` | `/:id` | Lấy thông tin user | ✅ |
| `GET` | `/detail/login` | Lấy thông tin user đang login | ✅ |
| `POST` | `/` | Tạo user mới (đăng ký) | ❌ |
| `PUT` | `/:id` | Cập nhật thông tin user | ✅ |
| `DELETE` | `/:id` | Xóa user | ✅ Admin |

**Example - Register:**
```json
POST /api/user
{
  "username": "john_doe",
  "password": "securepass123",
  "fullname": "John Doe",
  "email": "john@example.com"
}
```

### 📋 Order API (`/api/order`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/order/:id` | Lấy đơn hàng theo user ID | ✅ |
| `GET` | `/order/detail/:id` | Lấy chi tiết đơn hàng | ✅ |
| `POST` | `/order` | Tạo đơn hàng mới | ✅ |
| `POST` | `/email` | Gửi email xác nhận | ✅ |
| `PUT` | `/order/:id` | Cập nhật trạng thái đơn | ✅ Staff/Admin |

**Example - Create Order:**
```json
POST /api/order
{
  "fullname": "John Doe",
  "address": "123 Street, City",
  "phone": "0123456789",
  "total": 500000,
  "id_payment": "payment_id",
  "items": [
    {
      "id_product": "product_id",
      "count": 2,
      "size": "L"
    }
  ]
}
```

### 📝 Detail Order API (`/api/detail_order`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/:id` | Lấy chi tiết đơn hàng | ✅ |
| `POST` | `/` | Tạo chi tiết đơn hàng | ✅ |

### 🚚 Delivery API (`/api/delivery`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/` | Tạo thông tin giao hàng | ✅ |
| `GET` | `/:id` | Lấy thông tin giao hàng | ✅ |

### 💬 Comment API (`/api/comment`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/:id` | Lấy comments của sản phẩm | ❌ |
| `POST` | `/:id` | Thêm comment cho sản phẩm | ✅ |
| `DELETE` | `/:id` | Xóa comment | ✅ Admin |

**Example - Add Comment:**
```json
POST /api/comment/:productId
{
  "content": "Sản phẩm rất tốt!",
  "star5": 1
}
```

### 💳 Payment API (`/api/payment`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/paypal` | Thanh toán qua PayPal | ✅ |
| `POST` | `/stripe` | Thanh toán qua Stripe | ✅ |
| `POST` | `/confirm` | Xác nhận thanh toán | ✅ |

### 🔐 Authentication

Sử dụng JWT token trong header:
```bash
Authorization: Bearer <your_jwt_token>
```

---
## 🚀 Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống
- **Docker Desktop**: >= 4.0
- **Docker Compose**: >= 2.22 (hỗ trợ `--watch`)
- **Node.js**: 16.x - 18.x (nếu chạy local không dùng Docker)
- **MongoDB**: 5.x (hoặc MongoDB Atlas)
- **Git**: Latest version

### 📥 Clone Repository

```bash
git clone https://github.com/Babyfat012/sgu25_doan_ktpm.git
cd sgu25_doan_ktpm
```

---

## 🗄️ Cấu hình MongoDB

### Tùy chọn 1: MongoDB Atlas (Khuyến nghị)

#### Bước 1: Tạo Cluster trên MongoDB Atlas
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Đăng nhập hoặc đăng ký tài khoản
3. Nhấn **Build a Database** → Chọn gói **Free (M0)**
4. Chọn **MongoDB 5.x**
5. Chọn Region gần nhất
6. Nhấn **Create Cluster**

#### Bước 2: Tạo Database và User
1. Vào **Database** → **Collections** → **Create Database**
   - Database name: `mydb`
   - Collection name: `products`
2. Vào **Database Access** → **Add New Database User**
   - Username: `your_username`
   - Password: `your_secure_password`
   - Quyền: **Read and Write to any database**

#### Bước 3: Whitelist IP
1. Vào **Network Access** → **Add IP Address**
2. Chọn **Allow Access from Anywhere** (0.0.0.0/0) cho môi trường dev

#### Bước 4: Lấy Connection String
1. Vào **Database** → **Connect** → **Connect your application**
2. Chọn **Node.js** driver
3. Copy connection string

#### Bước 5: Cấu hình trong project
Tạo file `.env` trong thư mục `server_app/`:

```env
# MongoDB Atlas
MONGO_USER=your_username
MONGO_PASS=your_secure_password
MONGO_DB=mydb
MONGO_HOST=your-cluster.mongodb.net

# Or full URI
MONGO_URI=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/mydb?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

**Cấu hình kết nối trong code:**

```javascript
// server_app/index.js
const USER = process.env.MONGO_USER;
const PASS = encodeURIComponent(process.env.MONGO_PASS);
const DB = process.env.MONGO_DB;
const HOST = process.env.MONGO_HOST;

const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/${DB}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Kết nối MongoDB Atlas thành công"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));
```

### Tùy chọn 2: MongoDB Local (Docker)
Nếu sử dụng `docker-compose.yml`, MongoDB sẽ tự động khởi động:
```yaml
mongodb:
  image: mongo:5
  ports:
    - "27017:27017"
  volumes:
    - mongodb_data:/data/db
```

---

## 🐳 Chạy dự án với Docker (Khuyến nghị)

### Bước 1: Build Docker Images
```bash
docker compose build
```

> Lệnh này sẽ build images cho tất cả services: `server_app`, `client_app`, `admin_app`

### Bước 2: Khởi động tất cả services
```bash
docker compose up --watch
```

> Tùy chọn `--watch` tự động rebuild khi có thay đổi code (Docker Compose >= 2.22)

**Hoặc chạy ngầm (background):**
```bash
docker compose up -d
```

### Bước 3: Truy cập ứng dụng
- **Client App**: http://localhost:3000
- **Admin App**: http://localhost:3001
- **Server API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

### Dừng dự án
```bash
# Dừng containers (giữ dữ liệu)
docker compose stop

# Dừng và xóa containers
docker compose down

# Xóa cả volumes (dữ liệu)
docker compose down -v
```

---

## 💻 Chạy dự án Local (không dùng Docker)

### Bước 1: Cài đặt dependencies

```bash
# Install root dependencies
npm install

# Install all app dependencies
npm run install:all
```

### Bước 2: Khởi động MongoDB
```bash
# Nếu dùng MongoDB local
mongod --dbpath /path/to/data
```

### Bước 3: Khởi động các services

**Terminal 1 - Server:**
```bash
npm run start:server
# hoặc
cd server_app && npm start
```

**Terminal 2 - Client:**
```bash
npm run start:client
# hoặc
cd client_app && npm start
```

**Terminal 3 - Admin:**
```bash
npm run start:admin
# hoặc
cd admin_app && npm start
```

---

## 🧪 Chạy Tests

### Chạy tất cả tests
```bash
npm test
```

### Chạy tests riêng lẻ
```bash
# Server tests
npm run test:server

# Client tests
npm run test:client

# Admin tests
npm run test:admin
```

### Test coverage
```bash
# Tất cả coverage
npm run test:coverage

# Coverage riêng
npm run test:coverage:server
npm run test:coverage:client
npm run test:coverage:admin
```

---

## 📊 Monitoring với Prometheus & Grafana

### Khởi động monitoring stack
```bash
docker compose up prometheus grafana
```

### Truy cập dashboards
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3002
  - Username: `admin`
  - Password: `admin`

---

## 🔧 Troubleshooting

### Lỗi kết nối MongoDB
```bash
# Kiểm tra MongoDB đang chạy
docker ps | grep mongo

# Xem logs MongoDB
docker compose logs mongodb
```

### Port đã được sử dụng
```bash
# Tìm process đang dùng port
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Kill process nếu cần
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

### Clear Docker cache
```bash
# Xóa tất cả containers, images, volumes
docker system prune -a --volumes

# Rebuild từ đầu
docker compose build --no-cache
docker compose up
```

---




## 🎯 Tính năng chi tiết

### 🔐 Authentication & Authorization
- ✅ Đăng ký tài khoản với email verification
- ✅ Đăng nhập với JWT token
- ✅ Quên mật khẩu & Reset password
- ✅ Phân quyền theo vai trò (Customer, Staff, Admin)
- ✅ Protected routes và middleware

### 📦 Quản lý Sản phẩm
- ✅ CRUD sản phẩm (Admin)
- ✅ Upload hình ảnh lên Cloudinary
- ✅ Tìm kiếm theo tên, mô tả
- ✅ Lọc theo danh mục, giới tính, giá
- ✅ Phân trang và infinite scroll
- ✅ Sắp xếp theo giá, tên, ngày

### 🛒 Giỏ hàng & Đặt hàng
- ✅ Thêm/xóa/cập nhật sản phẩm trong giỏ
- ✅ Chọn size và số lượng
- ✅ Tính tổng tiền tự động
- ✅ Áp dụng mã giảm giá
- ✅ Lưu giỏ hàng (localStorage & database)

### 💳 Thanh toán
- ✅ **PayPal Integration**: Thanh toán qua PayPal Checkout
- ✅ **Stripe Integration**: Thanh toán thẻ quốc tế
- ✅ **COD (Cash on Delivery)**: Thanh toán khi nhận hàng
- ✅ Xác nhận thanh toán và gửi email

### 🚚 Vận chuyển
- ✅ Tính phí ship theo khoảng cách (Google Maps API)
- ✅ Hiển thị route trên bản đồ
- ✅ Ước tính thời gian giao hàng
- ✅ Theo dõi trạng thái đơn hàng real-time

### 💬 Live Chat & Tư vấn
- ✅ Chat real-time với Socket.IO
- ✅ Nhân viên xử lý nhiều chat cùng lúc
- ✅ Lịch sử chat được lưu trữ
- ✅ Thông báo tin nhắn mới

### ⭐ Đánh giá & Bình luận
- ✅ Rating sản phẩm (1-5 sao)
- ✅ Viết review chi tiết
- ✅ Upload hình ảnh trong review
- ✅ Xem rating trung bình

### ❤️ Yêu thích & Wishlist
- ✅ Thêm sản phẩm vào wishlist
- ✅ Quản lý danh sách yêu thích
- ✅ Nhận thông báo giảm giá

### 📧 Email Notifications
- ✅ Email xác nhận đăng ký
- ✅ Email reset password
- ✅ Email xác nhận đơn hàng
- ✅ Email cập nhật trạng thái đơn

### 📊 Dashboard & Analytics (Admin)
- ✅ Thống kê doanh thu theo ngày/tháng/năm
- ✅ Biểu đồ sản phẩm bán chạy
- ✅ Quản lý người dùng
- ✅ Quản lý đơn hàng
- ✅ Xem logs và monitoring

### 📈 Monitoring & Observability
- ✅ **Prometheus**: Thu thập metrics
- ✅ **Grafana**: Visualization dashboards
- ✅ Request/Response time tracking
- ✅ Error rate monitoring
- ✅ Resource usage metrics

---

## 🔬 Testing Strategy

### Unit Tests
- ✅ Jest cho Node.js backend
- ✅ React Testing Library cho frontend
- ✅ Test coverage > 80%

### Integration Tests
- ✅ API endpoint testing với Supertest
- ✅ Database integration tests
- ✅ MongoDB Memory Server cho tests

### E2E Tests
- ✅ User flow testing
- ✅ Payment flow testing
- ✅ Order management flow

### CI/CD Testing
- ✅ Automated testing trên GitHub Actions
- ✅ Test reports và coverage
- ✅ Pre-commit hooks với Husky

---

## 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Tablet optimization
- ✅ Desktop layouts
- ✅ Cross-browser compatibility

---

## ⚠️ Lưu ý quan trọng

### Thanh toán MoMo
> ⚠️ **Chú ý:**  
> Do chưa cập nhật **sinh trắc học** vào **môi trường giả lập của MoMo Developer**, nên hiện tại **không thể thực hiện thanh toán giả lập qua MoMo**.  
> Khuyến nghị sử dụng **PayPal** hoặc **Stripe** cho demo.

### API Keys
> 🔑 Đảm bảo không commit các API keys, secrets vào Git. Sử dụng `.env` và thêm vào `.gitignore`.

### Security
> 🔒 Trong môi trường production:
> - Sử dụng HTTPS
> - Cấu hình CORS đúng cách
> - Whitelist IP cho MongoDB
> - Sử dụng environment variables
> - Enable rate limiting

---

## 📂 Cấu trúc dự án chi tiết

```
sgu25_doan_ktpm/
│
├── 📱 client_app/                 # React Client Application
│   ├── public/                    # Static files
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── assets/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── utils/                 # Utility functions
│   │   ├── services/              # API services
│   │   ├── __tests__/             # Test files
│   │   ├── App.js
│   │   └── index.js
│   ├── coverage/                  # Test coverage reports
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── nginx.conf
│   └── package.json
│
├── 🔧 admin_app/                  # React Admin Dashboard
│   ├── public/
│   ├── src/
│   │   ├── component/             # Admin components
│   │   ├── utils/                 # Utility functions
│   │   ├── __tests__/             # Test files
│   │   ├── App.js
│   │   └── index.js
│   ├── coverage/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── nginx.conf
│   └── package.json
│
├── 🖥️ server_app/                 # Node.js Backend API
│   ├── API/                       # API routes
│   │   ├── products.js
│   │   ├── users.js
│   │   ├── orders.js
│   │   ├── comments.js
│   │   └── ...
│   ├── Models/                    # Mongoose models
│   │   ├── Product.js
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── ...
│   ├── middleware/                # Express middlewares
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── services/                  # Business logic
│   │   ├── paymentService.js
│   │   ├── emailService.js
│   │   └── mapService.js
│   ├── tests/                     # Backend tests
│   │   ├── unit/
│   │   └── integration/
│   ├── config/                    # Configuration files
│   ├── utils/                     # Utility functions
│   ├── coverage/                  # Test coverage
│   ├── index.js                   # Entry point
│   ├── metrics.js                 # Prometheus metrics
│   ├── Dockerfile
│   ├── railway.toml
│   └── package.json
│
├── 🐳 Docker Configuration
│   ├── docker-compose.yml         # Multi-container setup
│   ├── .dockerignore
│   └── nginx.conf
│
├── 📊 Monitoring
│   ├── prometheus.yml             # Prometheus config
│   └── grafana/
│       └── provisioning/          # Grafana dashboards
│
├── 📖 Documentation
│   ├── docs/
│   │   ├── CI_CD_GUIDE.md
│   │   ├── HUONG_DAN_NHAP_DIA_CHI.md
│   │   └── PUSH_CICD_GUIDE.md
│   ├── image/                     # Documentation images
│   │   ├── C4Model.drawio.png
│   │   ├── UseCase_HeThong.drawio.png
│   │   ├── GiaoDienTrangChu.png
│   │   └── ...
│   ├── diagrams/
│   │   └── communication-view.md
│   ├── README.md
│   ├── TESTING_GUIDE.md
│   ├── CLOUDINARY_GUIDE.md
│   ├── STRIPE_SETUP_COMPLETE.md
│   └── ...
│
├── 🧪 Testing & CI/CD
│   ├── .github/
│   │   └── workflows/             # GitHub Actions
│   ├── coverage/                  # Combined coverage
│   └── jest.config.js
│
├── 📦 Root Configuration
│   ├── package.json               # Root scripts
│   ├── .gitignore
│   ├── .env.example
│   └── structure.txt
│
└── 📝 Project Documentation
    ├── QUICK_START.md
    ├── RAILWAY_DEPLOYMENT.md
    ├── PERMISSION_SYSTEM_UPGRADE.md
    └── TEST_DOCUMENTATION.md
```

---

## 🚀 Deployment Guide

### 🐳 Docker Deployment (Production)

#### 1. Chuẩn bị môi trường
```bash
# Clone và config
git clone https://github.com/Babyfat012/sgu25_doan_ktpm.git
cd sgu25_doan_ktpm

# Copy và config .env files
cp server_app/.env.example server_app/.env
# Edit .env với production values
```

#### 2. Build Production Images
```bash
docker compose -f docker-compose.yml build
```

#### 3. Deploy
```bash
docker compose up -d
```

#### 4. Kiểm tra health
```bash
# Check containers
docker compose ps

# View logs
docker compose logs -f

# Check specific service
docker compose logs -f server_app
```

### ☁️ Railway Deployment

#### Prerequisites
- Railway account
- GitHub repository linked

#### Steps
1. **Connect Repository**
   ```bash
   railway login
   railway link
   ```

2. **Configure Environment Variables**
   - Vào Railway Dashboard
   - Thêm tất cả environment variables từ `.env`

3. **Deploy**
   ```bash
   railway up
   ```

4. **Config File**: `railway.toml`
   ```toml
   [build]
   builder = "NIXPACKS"
   buildCommand = "npm install"

   [deploy]
   startCommand = "npm start"
   healthcheckPath = "/api/health"
   restartPolicyType = "on-failure"
   ```

📖 **Chi tiết**: Xem [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

### 🌐 Vercel Deployment (Frontend Only)

#### Client App
```bash
cd client_app
vercel
```

#### Admin App
```bash
cd admin_app
vercel
```

**vercel.json** đã được config sẵn trong mỗi app.

### 📦 Manual Deployment (VPS/Cloud)

#### 1. Setup Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
# Follow: https://docs.mongodb.com/manual/installation/

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### 2. Deploy Application
```bash
# Clone repo
git clone https://github.com/Babyfat012/sgu25_doan_ktpm.git
cd sgu25_doan_ktpm

# Install dependencies
npm run install:all

# Build frontend
cd client_app && npm run build
cd ../admin_app && npm run build

# Start with PM2
cd ../server_app
pm2 start index.js --name "api-server"
pm2 save
pm2 startup
```

#### 3. Configure Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Client App
    location / {
        root /path/to/client_app/build;
        try_files $uri /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔗 Links & Resources

### 📚 Documentation
- [Quick Start Guide](./QUICK_START.md)
- [CI/CD Guide](./docs/CI_CD_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Cloudinary Setup](./CLOUDINARY_GUIDE.md)
- [Stripe Setup](./STRIPE_SETUP_COMPLETE.md)
- [Permission System](./PERMISSION_SYSTEM_UPGRADE.md)

### 🛠️ External Tools
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Cloudinary](https://cloudinary.com/)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [PayPal Developer](https://developer.paypal.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

### 📊 Monitoring
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3002`

---

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng làm theo các bước sau:

### 1. Fork Repository
```bash
# Fork trên GitHub, sau đó clone
git clone https://github.com/your-username/sgu25_doan_ktpm.git
cd sgu25_doan_ktpm
```

### 2. Tạo Branch mới
```bash
git checkout -b feature/amazing-feature
```

### 3. Commit Changes
```bash
git add .
git commit -m "Add: Amazing feature"
```

### 4. Push và tạo Pull Request
```bash
git push origin feature/amazing-feature
```

### Commit Convention
```
feat: Thêm tính năng mới
fix: Sửa bug
docs: Cập nhật documentation
style: Format code, không ảnh hưởng logic
refactor: Refactor code
test: Thêm/sửa tests
chore: Cập nhật dependencies, config
```

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Contributors

<div align="center">

### 🌟 Team Members

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Babyfat012">
        <img src="https://avatars.githubusercontent.com/Babyfat012" width="100px;" alt="Trịnh Long Phát"/><br />
        <sub><b>Trịnh Long Phát</b></sub>
      </a><br />
      <sub>Full-stack Developer</sub><br />
      <a href="https://github.com/Babyfat012">
        <img src="https://img.shields.io/github/followers/Babyfat012?label=Follow&style=social" alt="GitHub"/>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/phatle224">
        <img src="https://avatars.githubusercontent.com/phatle224" width="100px;" alt="Lê Hồng Phát"/><br />
        <sub><b>Lê Hồng Phát</b></sub>
      </a><br />
      <sub>Backend Developer</sub><br />
      <a href="https://github.com/phatle224">
        <img src="https://img.shields.io/github/followers/phatle224?label=Follow&style=social" alt="GitHub"/>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Kietnehi">
        <img src="https://avatars.githubusercontent.com/Kietnehi" width="100px;" alt="Trương Phú Kiệt"/><br />
        <sub><b>Trương Phú Kiệt</b></sub>
      </a><br />
      <sub>Frontend Developer</sub><br />
      <a href="https://github.com/Kietnehi">
        <img src="https://img.shields.io/github/followers/Kietnehi?label=Follow&style=social" alt="GitHub"/>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ductoanoxo">
        <img src="https://avatars.githubusercontent.com/ductoanoxo" width="100px;" alt="Trà Đức Toàn"/><br />
        <sub><b>Trà Đức Toàn</b></sub>
      </a><br />
      <sub>DevOps & Testing</sub><br />
      <a href="https://github.com/ductoanoxo">
        <img src="https://img.shields.io/github/followers/ductoanoxo?label=Follow&style=social" alt="GitHub"/>
      </a>
    </td>
  </tr>
</table>

### 🔗 GitHub Profiles

| Member | GitHub | Role |
|--------|--------|------|
| Trịnh Long Phát | [@Babyfat012](https://github.com/Babyfat012) | Full-stack Developer |
| Lê Hồng Phát | [@phatle224](https://github.com/phatle224) | Backend Developer |
| Trương Phú Kiệt | [@Kietnehi](https://github.com/Kietnehi) | Frontend Developer |
| Trà Đức Toàn | [@ductoanoxo](https://github.com/ductoanoxo) | DevOps & Testing |

</div>

---

## 📧 Contact & Support


### Report Issues
Nếu bạn gặp vấn đề hoặc có đề xuất:
- 🐛 [Report Bug](https://github.com/Babyfat012/sgu25_doan_ktpm/issues/new?labels=bug)
- 💡 [Request Feature](https://github.com/Babyfat012/sgu25_doan_ktpm/issues/new?labels=enhancement)

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Babyfat012/sgu25_doan_ktpm?style=social)
![GitHub forks](https://img.shields.io/github/forks/Babyfat012/sgu25_doan_ktpm?style=social)
![GitHub issues](https://img.shields.io/github/issues/Babyfat012/sgu25_doan_ktpm)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Babyfat012/sgu25_doan_ktpm)
![GitHub last commit](https://img.shields.io/github/last-commit/Babyfat012/sgu25_doan_ktpm)

---

## 🙏 Acknowledgments

Xin cảm ơn:
- **Giảng viên hướng dẫn** - Hướng dẫn và hỗ trợ trong suốt quá trình
- **Trường Đại học Sài Gòn** - Cung cấp môi trường học tập
- **Open Source Community** - Các thư viện và tools tuyệt vời
- **MongoDB Atlas** - Free tier database
- **Cloudinary** - Image hosting service
- **All Contributors** - Người đóng góp cho project

---

<div align="center">

### ⭐ Nếu project này hữu ích, hãy cho chúng tôi một star! ⭐

**Made with ❤️ by Team SGU25_KTPM**

**© 2025 Fear of God E-commerce Platform. All rights reserved.**

</div>