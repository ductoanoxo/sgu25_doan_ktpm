# Tóm Tắt Chỉnh Sửa Logic User và Customer

## Vấn Đề Đã Tìm Thấy

### 1. **User.jsx** (Admin Users)
- ❌ Không có filter riêng biệt, hiển thị cả customers lẫn admin users
- ❌ Title không rõ ràng

### 2. **UserCus.jsx** (Customers)
- ❌ Hardcode permission ID: `'6087dcb5f269113b3460fce4'`
- ❌ Link update sai: `"user/update/"` thay vì `"customer/update/"`
- ❌ Title không chính xác: "Users" thay vì "Customers"

### 3. **CreateUserCus.jsx**
- ❌ Hardcode permission ID cố định
- ❌ Title không chính xác: "Create User" thay vì "Create Customer"
- ❌ Không linh hoạt nếu permission ID thay đổi

### 4. **UpdateUserCus.jsx**
- ❌ Hardcode permission ID
- ❌ Title không chính xác: "Update User" thay vì "Update Customer"
- ❌ Validation kiểm tra permission nhưng không load danh sách permissions

### 5. **Backend API**
- ❌ Logic filter không đủ linh hoạt
- ❌ Không hỗ trợ excludeCustomer và customerOnly flags

---

## Các Thay Đổi Đã Thực Hiện

### 📁 **admin_app/src/component/User/User.jsx**
**Mục đích:** Chỉ hiển thị Admin/Staff users, loại trừ customers

```jsx
// ✅ Thêm flag excludeCustomer
const [filter, setFilter] = useState({
    page: '1',
    limit: '4',
    search: '',
    status: true,
    excludeCustomer: true  // Loại trừ customers
})

// ✅ Đổi title rõ ràng hơn
<h4 className="card-title">Admin Users</h4>
```

---

### 📁 **admin_app/src/component/UserCus/UserCus.jsx**
**Mục đích:** Chỉ hiển thị customers

```jsx
// ✅ Bỏ hardcode permission ID, dùng flag customerOnly
const [filter, setFilter] = useState({
    page: '1',
    limit: '4',
    search: '',
    status: true,
    customerOnly: true  // Chỉ hiển thị customers
})

// ✅ Đổi title
<h4 className="card-title">Customers</h4>

// ✅ Sửa link update
<Link to={"/customer/update/" + value._id} className="btn btn-success mr-1">Update</Link>
```

---

### 📁 **admin_app/src/component/UserCus/CreateUserCus.jsx**
**Mục đích:** Tự động gán customer permission, không hardcode ID

```jsx
// ✅ Không hardcode permission ID
const [permissionChoose, setPermissionChoose] = useState('');

// ✅ Tự động tìm và gán customer permission
useEffect(() => {
    const fetchAllData = async () => {
        const ps = await permissionAPI.getAPI();
        setPermission(ps)
        // Tự động tìm customer permission theo tên
        const customerPermission = ps.find(p => p.permission.toLowerCase() === 'customer');
        if (customerPermission) {
            setPermissionChoose(customerPermission._id);
        }
    }
    fetchAllData()
}, [])

// ✅ Đổi title
<h4 className="card-title">Create Customer</h4>
```

---

### 📁 **admin_app/src/component/UserCus/UpdateUserCus.jsx**
**Mục đích:** Load permission động, không hardcode

```jsx
// ✅ Load danh sách permissions
const [permission, setPermission] = useState([])

// ✅ Load permission hiện tại hoặc tự động gán customer
useEffect(() => {
    const fetchAllData = async () => {
        const ps = await permissionAPI.getAPI();
        const rs = await userApi.details(id)
        setPermission(ps)
        
        if (rs.id_permission) {
            setPermissionChoose(rs.id_permission);
        } else {
            const customerPermission = ps.find(p => p.permission.toLowerCase() === 'customer');
            if (customerPermission) {
                setPermissionChoose(customerPermission._id);
            }
        }
    }
    fetchAllData()
}, [])

// ✅ Validation message rõ ràng hơn
if (isEmpty(permissionChoose)) {
    msg.permission = "Permission không hợp lệ"
}

// ✅ Đổi title
<h4 className="card-title">Update Customer</h4>
```

---

### 📁 **server_app/API/Controller/admin/user.controller.js**
**Mục đích:** Hỗ trợ filter linh hoạt hơn

```javascript
// ✅ Logic filter mới
module.exports.index = async(req, res) => {
    let query = {};
    
    // Filter theo permission cụ thể
    if (req.query.permission) {
        query.id_permission = req.query.permission;
    }
    
    // ✅ Chỉ lấy customers
    if (req.query.customerOnly === 'true') {
        query.id_permission = '6087dcb5f269113b3460fce4';
    }
    
    // ✅ Loại trừ customers (chỉ lấy admin/staff)
    if (req.query.excludeCustomer === 'true') {
        query.id_permission = { $ne: '6087dcb5f269113b3460fce4' };
    }
    
    users = await User.find(query).populate('id_permission');
    
    // Fix totalPage calculation
    const totalPage = Math.ceil(users.length / perPage);
    // ...
}
```

---

## Lợi Ích Của Các Thay Đổi

### ✅ **Phân tách rõ ràng**
- **User**: Quản lý admin/staff users
- **Customer**: Quản lý khách hàng

### ✅ **Không hardcode**
- Tự động tìm customer permission theo tên
- Linh hoạt khi permission ID thay đổi

### ✅ **Backend linh hoạt**
- Hỗ trợ nhiều cách filter:
  - `customerOnly=true`: Chỉ customers
  - `excludeCustomer=true`: Chỉ admin/staff
  - `permission=<id>`: Filter theo permission cụ thể

### ✅ **UI/UX rõ ràng**
- Title phân biệt: "Admin Users" vs "Customers"
- Link navigation đúng: `/user/update/` vs `/customer/update/`

---

## Kiểm Tra

### 1. **Trang User** (`/user`)
- Chỉ hiển thị admin/staff users
- Không hiển thị customers

### 2. **Trang Customer** (`/customer`)
- Chỉ hiển thị customers
- Link update đúng: `/customer/update/:id`

### 3. **Create Customer** (`/customer/create`)
- Tự động gán customer permission
- Không cần chọn permission thủ công

### 4. **Update Customer** (`/customer/update/:id`)
- Load permission hiện tại
- Có thể thay đổi nếu cần

---

## Lưu Ý

⚠️ **Permission ID `'6087dcb5f269113b3460fce4'`** vẫn được sử dụng trong backend để tham chiếu đến "Customer" permission. Nếu bạn muốn hoàn toàn loại bỏ hardcode này, cần:

1. **Cách 1:** Thêm field `isCustomer: true` vào Permission model
2. **Cách 2:** Query permission theo tên "Customer" mỗi lần cần
3. **Cách 3:** Lưu permission ID vào config/environment variable

### Khuyến nghị: Cách 1
```javascript
// Models/permission.js
const permissionSchema = new Schema({
    permission: String,
    isCustomer: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
})

// Backend query
const customerPermission = await Permission.findOne({ isCustomer: true });
```

---

## Test Cases

### ✅ Test 1: Hiển thị danh sách
- [ ] `/user` chỉ hiển thị admin/staff
- [ ] `/customer` chỉ hiển thị customers
- [ ] Search hoạt động đúng trên cả 2 trang

### ✅ Test 2: Create
- [ ] Create User: Chọn được permission admin/staff
- [ ] Create Customer: Tự động gán customer permission

### ✅ Test 3: Update
- [ ] Update User: Có thể đổi permission
- [ ] Update Customer: Giữ nguyên customer permission
- [ ] Link navigation đúng

### ✅ Test 4: Delete
- [ ] Delete User: Hoạt động bình thường
- [ ] Delete Customer: Hoạt động bình thường

---

## Kết Luận

✅ Logic đã được **phân tách rõ ràng** giữa User (Admin/Staff) và Customer
✅ **Không còn hardcode** permission ID ở frontend
✅ Backend **hỗ trợ filter linh hoạt**
✅ UI/UX **rõ ràng và dễ hiểu** hơn

**Ngày cập nhật:** 2025-11-07
