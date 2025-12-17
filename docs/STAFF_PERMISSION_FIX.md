# 🔧 Sửa Lỗi Permission Cho Nhân Viên (Staff)

## 🐛 Vấn Đề Ban Đầu

Khi đăng nhập bằng tài khoản **Nhân Viên**, người dùng chỉ được redirect tới trang `/customer` và không thể truy cập các chức năng khác như Product, Order, Coupon, Category, v.v.

### Nguyên nhân:

1. **File `Menu.jsx`**: Logic kiểm tra permission chỉ cho phép `Admin` truy cập → chặn hoàn toàn Staff
2. **File `Login.jsx`**: Sau khi login, Staff bị redirect cố định tới `/customer` thay vì có quyền truy cập menu

---

## ✅ Giải Pháp Đã Áp Dụng

### 1. **Sửa Logic Menu (admin_app/src/component/Shared/Menu.jsx)**

#### Thay đổi:
- ❌ **Trước**: Chỉ cho phép `user.id_permission.permission === "Admin"`
- ✅ **Sau**: Cho phép cả `isAdmin === true` HOẶC `isStaff === true`

#### Chi tiết:
```javascript
// Kiểm tra quyền linh hoạt hơn
const userPermission = user?.id_permission;
const isAdmin = userPermission?.isAdmin === true || userPermission?.permission === "Admin";
const isStaff = userPermission?.isStaff === true || userPermission?.permission === "Nhân Viên";

// Chặn chỉ customer, cho phép Admin và Staff
if (!isAdmin && !isStaff) {
    return <Redirect to="/" />;
}
```

#### Menu Items Filtering:
- **Admin thấy**: TẤT CẢ menu (Customer, User, Permission, Product, Order, Coupon, Category, Sale)
- **Staff thấy**: Product, Order, Coupon, Category, Sale, Delivery (KHÔNG thấy Customer, User, Permission)

```javascript
const filteredMenu = menu.filter(item => {
    if (item.requireAdmin) {
        return isAdmin; // Chỉ Admin mới thấy
    }
    return true; // Admin và Staff đều thấy
});
```

---

### 2. **Sửa Logic Login (admin_app/src/component/Login/Login.jsx)**

#### Thay đổi:
- ❌ **Trước**: 
  - Staff → redirect tới `/customer` (chỉ 1 trang)
  - Admin → redirect tới `/user`
  
- ✅ **Sau**: 
  - Staff/Admin → redirect tới `/product` (có thể truy cập tất cả menu được phép)

#### Chi tiết:
```javascript
const userPermission = response.user.id_permission;
const isAdmin = userPermission?.isAdmin === true || userPermission?.permission === "Admin";
const isStaff = userPermission?.isStaff === true || userPermission?.permission === "Nhân Viên";

if (isAdmin || isStaff) {
    addLocal(response.jwt, response.user)
    history.push('/product') // Redirect tới trang có nhiều tùy chọn
} else {
    setValidationMsg({ api: "Bạn không có quyền truy cập. Chỉ Admin và Nhân Viên mới có thể đăng nhập." })
}
```

---

## 📊 Quyền Của Staff Theo Cấu Hình Hiện Tại

### Permission Level (từ server_app/index.js):

```javascript
staffPerm = {
    permission: 'Nhân Viên',
    level: 50,
    isStaff: true,
    permissions: {
        products: { view: true, create: true, edit: true, delete: false },
        categories: { view: true, create: false, edit: false, delete: false },
        users: { view: true, create: false, edit: false, delete: false },
        orders: { view: true, create: false, edit: true, delete: false },
        coupons: { view: true, create: true, edit: true, delete: false },
        sales: { view: true, create: false, edit: false, delete: false },
        permissions: { view: true, create: false, edit: false, delete: false }
    }
}
```

### Menu Staff Có Thể Truy Cập:

| Menu Item | Staff Access | Admin Access |
|-----------|--------------|--------------|
| **Product** | ✅ Yes | ✅ Yes |
| **Category** | ✅ Yes | ✅ Yes |
| **Order** | ✅ Yes | ✅ Yes |
| **ConfirmOrder** | ✅ Yes | ✅ Yes |
| **Delivery** | ✅ Yes | ✅ Yes |
| **ConfirmDelivery** | ✅ Yes | ✅ Yes |
| **CompletedOrder** | ✅ Yes | ✅ Yes |
| **CancelOrder** | ✅ Yes | ✅ Yes |
| **Coupon** | ✅ Yes | ✅ Yes |
| **Sale** | ✅ Yes | ✅ Yes |
| **Customer** | ❌ No (Admin only) | ✅ Yes |
| **User** | ❌ No (Admin only) | ✅ Yes |
| **Permission** | ❌ No (Admin only) | ✅ Yes |

---

## 🎯 Kết Quả

### Trước khi sửa:
- ❌ Staff đăng nhập → chỉ thấy trang Customer
- ❌ Staff không thấy menu sidebar
- ❌ Staff không thể làm gì khác

### Sau khi sửa:
- ✅ Staff đăng nhập → truy cập được Product, Order, Coupon, Category, Sale, Delivery
- ✅ Staff thấy menu sidebar với các mục họ có quyền
- ✅ Staff có thể quản lý hàng hóa, đơn hàng, coupon theo quyền đã cấu hình
- ✅ Staff KHÔNG thấy Customer, User, Permission (chỉ Admin)

---

## 🚀 Cách Test

### Test 1: Đăng nhập Staff
```
1. Login với tài khoản có permission "Nhân Viên"
2. Kiểm tra redirect tới /product
3. Kiểm tra sidebar menu → phải thấy: Product, Category, Order, Coupon, Sale
4. Kiểm tra KHÔNG thấy: Customer, User, Permission
```

### Test 2: Đăng nhập Admin
```
1. Login với tài khoản có permission "Admin"
2. Kiểm tra redirect tới /product (hoặc /user)
3. Kiểm tra sidebar menu → phải thấy TẤT CẢ menu items
```

### Test 3: Permission Check
```
1. Đăng nhập Staff
2. Thử access /customer, /user, /permission bằng URL trực tiếp
3. Nếu bị chặn → OK (đúng logic)
4. Nếu vào được → cần thêm route protection
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Route Protection (Cần Cải Thiện Sau)
Hiện tại chỉ ẩn menu items, nhưng Staff vẫn có thể access URL trực tiếp như `/customer`, `/user` nếu biết link.

**Giải pháp**: Cần thêm middleware hoặc Protected Route component:
```jsx
// Ví dụ:
<ProtectedRoute 
    path="/customer" 
    component={UserCus} 
    requiredPermission="admin"
/>
```

### 2. CRUD Permissions Chi Tiết
Backend đã có `permissions` object chi tiết (view, create, edit, delete) cho từng module nhưng frontend chưa implement logic này.

**Cần làm thêm**: 
- Check permissions.products.delete trước khi hiển thị nút Delete
- Check permissions.orders.edit trước khi cho phép edit order
- v.v.

### 3. Permissions Object Chưa Được Sử Dụng
Database có field `permissions` với CRUD chi tiết nhưng frontend chỉ dùng `isAdmin`, `isStaff` để check.

**Tương lai**: Implement logic dựa trên `user.id_permission.permissions.products.create` thay vì chỉ check role.

---

## 📝 Files Đã Thay Đổi

1. ✅ `admin_app/src/component/Shared/Menu.jsx`
   - Sửa logic kiểm tra permission
   - Thêm menu filtering dựa trên role
   - Hiển thị "(Nhân Viên)" hoặc "(Admin)" trên sidebar

2. ✅ `admin_app/src/component/Login/Login.jsx`
   - Sửa logic redirect sau login
   - Cải thiện error message
   - Thống nhất cách check permission

---

## 🎉 Kết Luận

Hệ thống permission đã được sửa để **Nhân Viên (Staff)** có thể truy cập và sử dụng các chức năng quản lý như:
- ✅ Quản lý sản phẩm (Product)
- ✅ Quản lý đơn hàng (Order, Delivery)
- ✅ Quản lý coupon
- ✅ Quản lý category
- ✅ Xem sales

Trong khi vẫn giữ các tính năng quản lý user và permission chỉ dành cho Admin.

**Next Steps**:
1. Test kỹ với tài khoản Staff thật
2. Cân nhắc thêm route protection
3. Implement CRUD permissions chi tiết nếu cần
