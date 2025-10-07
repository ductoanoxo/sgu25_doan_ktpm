
# Đồ án môn kiểm thử phần mềm

## Thông tin chung
- **Tên đề tài:** Website bán quần áo 
- **Môn học:** Kiểm thử phần mềm
- **Lớp:** [DCT122C3]

## Thành viên nhóm
1. Trịnh Long Phát
2. Lê Hồng Phát 
3. Trương Phú Kiệt
4. Trà Đức Toàn

## Mô tả dự án
Website Fear Of God hỗ trợ các kịch bản kinh doanh chính bao gồm: Danh mục sản phẩm, Giỏ hàng, Quy trình đặt hàng, Thanh toán, Giao hàng, Trò chuyện trực tuyến, Xác nhận Email và Kiểm soát truy cập.

## Công nghệ sử dụng
- [Liệt kê các công nghệ/framework được sử dụng]

## Cấu trúc dự án
```
project/
├── src/
├── tests/
├── docs/
└── README.md
```

## Hướng dẫn cài đặt
1. Clone repository
2. [Các bước cài đặt]

## Hướng dẫn chạy test
[Thêm hướng dẫn để chạy các test case]

<h2>Xây dựng Website bán quần áo sử dụng công nghệ ReactJS & NodeJS ( API,Socket )</h2>
<h3>Mô tả chung , giới thiệu đề tài </h3>
<b>Ngày nay , công nghệ thông tin đã có những bước phát triển mạnh mẽ trong mọi phương diện nói chung ví dụ như : đời sống , công việc , giải trí , truyền thông , ... Và riêng với bán hàng , so với cách bán truyền thống thì nay doanh nghiệp , cửa hàng nhỏ lẻ nào cũng có một website để quáng bá , bán hàng trực tuyến sản phẩm và tương tác với người dùng . Nắm bắt được nhu cầu đó , nhóm em quyết định thực hiện đề tài : Xây dựng Website bán quần áo sử dụng công nghệ ReactJS & NodeJS ( API,Socket ) . Khi sử dụng trang web khách hàng sẽ cảm nhận được sự mới mẻ và thuận tiện của Website mang lại . Và website cũng dễ dàng cung cấp thông tin chi tiết sản phẩm giúp khách hàng có thể thanh toán trực tiếp qua paypal hoặc ship cod .</b>
<h3>Website bao gồm các chức năng chính: </h3>
    <b>- Thêm, Xóa, Tìm Kiếm, Phân Trang, Phân Loại Sản Phẩm </b> </br>
    <b>- Đặt Hàng </b> </br>
    <b>- Live Chat ( Tư Vấn Khách Hàng ) </b> </br>
    <b>- Gửi Email để xác nhận đơn hàng </b> </br>
    <b>- Thanh Toán Paypal  </b> </br>
    <b>- Giao Hàng ( Hiển thị và tính giá tiền của đơn hàng phụ thuộc vào quảng đường từ cửa hàng đến địa điểm nhận hàng của khách hàng và hiển thị bằng Google Map API )  </b> </br>


---------------------------------------------------------------

 
## Fear of God

![](https://thegioidohieu.com/images/feature_variant/17/fear-of-god-logo.jpg)


## Contributors
- TienKim
- QuocToan
- MinhHieu

## ERD
<img src="https://firebasestorage.googleapis.com/v0/b/todo-app-tienkim.appspot.com/o/diagram.PNG?alt=media&token=656d0b0c-0540-4257-a90a-3c024f50946b" />

## USECASE
<h3>* Khách Hàng</h3>
<img src="https://firebasestorage.googleapis.com/v0/b/todo-app-tienkim.appspot.com/o/KhachHang.PNG?alt=media&token=07f504bd-6d34-4da4-abe7-a82de78293d2" />

<h3>* Nhân Viên Bán Hàng</h3>
<img src="https://firebasestorage.googleapis.com/v0/b/todo-app-tienkim.appspot.com/o/NhanVien.PNG?alt=media&token=a6f82edc-64fc-4086-bcd9-0ba490f213eb" />

<h3>* ADMIN</h3>
<img src="https://firebasestorage.googleapis.com/v0/b/todo-app-tienkim.appspot.com/o/Admin.PNG?alt=media&token=0e9b75b8-1720-402b-9f76-b64614fe7f12" />

## DESIGN DATABASE

- Product: _id, id_category, name_product, price_product, image, describe, gender, number
    + _id: id của sản phẩm,
    id_category: id của loại sản phẩm,
    name_product: tên của sản phẩm,
    price_product: giá của sản phẩm,
    image: hình ảnh của sản phẩm,
    describe: mô tả về sản phẩm,
    gender: sản phẩm thuộc giới tính,
    number: số lượng tồn,
    bảng Product có quan hệ một nhiều với bảng Category 
    bảng Product có quan hệ một nhiều với bảng Favorite
    bảng Product có quan hệ một nhiều với bảng Comment
    bảng Product có quan hệ một nhiều với bảng Detail_Oder
    + 1 product sẽ có 1 category
    + 1 product sẽ có nhiều favorite
    + 1 product sẽ có nhiều comment
    + 1 product sẽ có 1 detail_order
- Category: _id, category
    + _id: id của loại sản phẩm,
    category: tên của loại
    bảng Category có quan hệ một nhiều với bảng Product
    + 1 category sẽ có nhiều product
- User: _id, username, password, fullname, email, id_permission
    + _id: id của khách hàng,
    username: tên đăng nhập của khách hàng,
    password: mật khẩu đăng nhập của khách hàng,
    fullname: tên của khách hàng,
    email: email của khách hàng,
    id_permission: id permission thuộc bảng Permission,
    bảng User có quan hệ một nhiều với bảng Permission,
    bảng User có quan hệ một nhiều với bảng Comment,
    bảng User có quan hệ một nhiều với bảng Order,
    bảng User có quan hệ một nhiều với bảng Favorite
    + 1 user sẽ có nhiều comment
    + 1 user sẽ có 1 permission
    + 1 user sẽ có nhiều favorite
    + 1 user sẽ có nhiều order
- Permission: _id, permission
    + _id: id của quyền,
    permission: tên của quyền,
    bảng permission có quan hệ một nhiều với bảng user
    + 1 permission sẽ có nhiều user
- Order: _id, fullname, address, phone, total, status, id_user, id_payment, id_delivery
    + _id: id của đơn hàng,
    fullname: tên của người nhận hàng,
    address: địa chỉ của người nhận hàng,
    phone: số điện thoại của người nhận hàng,
    total: tổng tiền của đơn hàng,
    status: trạng thái của đơn hàng đó (1 - Chưa xác nhận, 2 - Đã xác nhận, 3 - Đang vận chuyển, 4 - Hoàn thành, 5 - Hủy đơn hàng),
    id_user: id của khách hàng,
    id_payment: id của phương thức thanh toán,
    id_delivery: id của phương thức vận chuyển,
    bảng Order có quan hệ một nhiều với bảng Detail_Order,
    bảng Order có quan hệ một một với Delivery vì hệ thông chỉ có 1 phương thức vận chuyển DRIVING,
    + Fullname, address, phone có thể được tùy chọn phụ thuộc vào người nhận hàng
    + 1 order sẽ có 1 delivery
    + 1 order sẽ có 1 payment
    + 1 order sẽ có nhiều detail_order
    + Nhiều order sẽ thuộc 1 user
- Detail_Order: _id, price_product, name_product, count, size, id_order, id_product
    + _id: id của chi tiết đơn hàng,
    price_product: giá của sản phẩm,
    name_product: tên của sản phẩm,
    count: số lượng của sản phẩm,
    size: kích thước của sản phẩm,
    id_order: id của đơn hàng,
    id_product: id của sản phẩm,
    bảng detail_order sẽ có quan hệ một một với bảng product
    bảng detail_order sẽ có quan hệ một nhiều với bảng order
    + Khi product mình thay đổi thì bên detail_order cũng sẽ thay đổi nên mình phải thêm 2 trường         name_product, price_product tránh trường hợp điều đó xảy ra.
    + 1 detail_order sẽ có 1 product
    + Nhiều detail_order sẽ thuộc 1 order
- Payment: _id, pay_name,
    + _id: id của phương thức thanh toán,
    pay_name: tên phương thức thanh toán,
    bảng payment sẽ có quan hệ một nhiều với bảng order
    + 1 payment sẽ có nhiều order
- Comment: _id, content, star1, star2, star3, star4, star5, id_user, id_product,
    + _id: id của bình luận,
    content: nội dung của đánh giá,
    star1, star2, star3, star4, star5: là số sao mà khách hàng đánh giá,
    id_user: id của khách hàng mà đánh giá,
    id_product: id của sản phẩm đánh giá,
    bảng comment sẽ có quan hệ một nhiều với bảng product
    bảng comment sẽ có quan hệ một nhiều với bảng user
    + Nhiều comment sẽ thuộc 1 user
    + Nhiều comment sẽ thuộc 1 product
- Favorite: _id, id_user, id_product
    + _id: là id của favorite,
    id_user: id của khách hàng,
    id_product: id của sản phẩm
    bảng favorite sẽ có quan hệ một nhiều với bảng product
    bảng favorite sẽ có quan hệ một nhiều với bảng user
    + Nhiều favorite thuộc 1 product
    + Nhiều favorite thuộc 1 user
- Note: _id, fullname, phone
    + _id: id của phương thức vận chuyện,
    fullname: tên của người nhận hàng,
    phone: điện thoại của người nhận hàng,
    bảng Note sẽ có quan hệ một một với bảng Order
    + 1 Note sẽ thuộc 1 order

## API
## Root API Endpoint

`http://tienkim9920.herokuapp.com`

> ⚠️ **Lưu ý:** API này đã **ngừng hoạt động**. Endpoint chỉ dùng để **minh họa cách API hoạt động**.

```bash

- api/product : PRODUCT API ENDPOINT

    - router.get('/', Products.index)

    - router.get('/category', Products.category)

    - router.get('/:id', Products.detail)

    - router.get('/category/gender', Products.gender)

    - router.get('/category/pagination', Products.pagination)

    - router.get('/scoll/page', Products.scoll)
  
- api/user : USER API ENDPOINT

    - router.get('/', Users.index)

    - router.get('/:id', Users.user)

    - router.get('/detail/login', Users.detail)

    - router.post('/', Users.post_user)
   
- api/detail_order : DETAIL ORDER API ENDPOINT

    - router.get('/:id', Detail_Order.detail)

    - router.post('/', Detail_Order.post_detail_order)

- api/order : ORDER API ENDPOINT

    - router.get('/order/:id', Order.get_order)

    - router.get('/order/detail/:id', Order.get_detail)

    - router.post('/order', Order.post_order)

    - router.post('/email', Order.send_mail)

- api/delivery : DELIVERY API ENDPOINT

    - router.post('/', Delivery.post_delivery)

    - router.get('/:id', Delivery.get_delivery)

- api/comment : COMMENT API ENDPOINT

    - router.get('/:id', Comment.index)

    - router.post('/:id', Comment.post_comment)
    


```
## Get Started

# 🚀 Hướng dẫn cài đặt & kết nối MongoDB Atlas

## 1️⃣ Tạo Cluster trên MongoDB Atlas  
- Vào [MongoDB Atlas](https://www.mongodb.com/atlas/database) → Đăng nhập hoặc đăng ký.  
- Nhấn **Build a Database** → chọn gói Free (Shared Cluster).  
- Chọn phiên bản **MongoDB 5.5**.  
- Chọn Region gần bạn để có tốc độ tốt.  
- Nhấn **Create Cluster**.  

## 2️⃣ Tạo Database và User  
- Vào **Database** → **Collections** → **Create Database**.  
  - Database name: `mydb` (thay tên nếu muốn).  
  - Collection name: ví dụ `users`.  
- Vào **Database Access** → **Add New Database User**.  
  - Username: `toantra349`.  
  - Password: `toantoan123` (nên đặt password mạnh hơn).  
  - Chọn quyền **Read and Write to any database**.  

## 3️⃣ Lấy Connection URI  
- Vào **Database** → **Connect** → **Connect your application**.  
- Chọn **Node.js** và copy connection string.  
- Sau đó thay các biến theo ví dụ bên dưới.

## 4️⃣ Cấu hình kết nối trong `index.js` (server)  

```javascript
const USER = "toantra349"; // Thay bằng username bạn tạo
const PASS = encodeURIComponent("toantoan123"); // Thay bằng password bạn tạo
const DB = "mydb"; // Tên database
const HOST = "ktpm.dwb8wtz.mongodb.net"; // Host của cluster

const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/${DB}?retryWrites=true&w=majority`;

const mongoose = require('mongoose');

mongoose.connect(uri)
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB Atlas:", err));
```
## 🛠️ Chạy dự án trong thư mục gốc với Docker

### 🔧 Bước 1: Build (tạo image Docker)
Chạy lệnh sau để **xây dựng lại image** của dự án dựa trên file `Dockerfile` và cấu hình trong `docker-compose.yml`:

```bash
docker compose build
```

> 🧩 Lệnh này sẽ tải các dependencies cần thiết, cài đặt môi trường, và chuẩn bị container cho ứng dụng của bạn.

---

### 🚀 Bước 2: Khởi động dự án
Sau khi build xong, khởi động toàn bộ các service (backend, frontend, database, v.v.) bằng lệnh:

```bash
docker compose up --watch
```

> 🔁 Tuỳ chọn `--watch` (chỉ có ở **Docker Compose v2.22+**) cho phép **tự động rebuild** và **restart container** khi bạn thay đổi mã nguồn trong thư mục dự án — rất hữu ích khi phát triển.

---

### 💡 Ghi chú thêm
- Nếu đây là lần đầu bạn chạy dự án, Docker sẽ tự động **tải các image phụ thuộc** (ví dụ: Node, Python, PostgreSQL, v.v.)
- Để dừng tất cả container, nhấn **`Ctrl + C`**, hoặc chạy:
  ```bash
  docker compose down
  ```
- Nếu muốn chạy ngầm (background), thêm cờ `-d`:
  ```bash
  docker compose up -d
  ```




## Features
- Login, Register, Forgot Password, ResetPassword .
- CRUD Products, Users, Carts, Favorite, Order...
- Axios Products, Carts, Orders...
- Products url query (http://tienkim9920.herokuapp.com/api/product)
- Send email to user.
- Draw route between two location
- Payment on paypal
- Plugin Messenger of Facebook


## Technical details
- Nodejs, Reactjs.
- Express.
- Mongodb, Mongoose.
- Nodemailer. 
> ⚠️ **Lưu ý:**  
> Do chưa cập nhật **sinh trắc học** vào **môi trường giả lập của MoMo**, nên hiện tại **không thể thực hiện chuyển khoản giả lập qua MoMo Developer**.  
> Hệ thống giả lập vẫn chưa được cập nhật nên **chưa thể tiến hành test** được.
