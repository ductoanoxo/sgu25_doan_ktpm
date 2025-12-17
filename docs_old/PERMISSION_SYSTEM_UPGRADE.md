# 🔐 Hệ Thống Quản Lý Phân Quyền - Nâng Cấp Toàn Diện

## 📋 Tổng Quan

Hệ thống quản lý phân quyền đã được nâng cấp toàn diện với các tính năng mới:

### ✨ Tính Năng Mới

1. **Phân cấp quyền chi tiết** với level (0-100)
2. **Mô tả quyền** để giải thích rõ từng role
3. **Role flags**: `isAdmin`, `isStaff`, `isCustomer`
4. **System permissions**: Không thể xóa các quyền hệ thống
5. **User count tracking**: Hiển thị số người dùng đang sử dụng quyền
6. **Protection**: Không cho xóa quyền đang được sử dụng
7. **Detailed permissions**: CRUD permissions cho từng module
8. **UI/UX cải thiện**: Badges, icons, warnings

---

## 🏗️ Cấu Trúc Mới

### Permission Model Schema

```javascript
{
  permission: String,          // Tên quyền (unique)
  description: String,         // Mô tả chi tiết
  level: Number,              // 0-100 (100 = cao nhất)
  isAdmin: Boolean,           // Flag admin
  isStaff: Boolean,           // Flag nhân viên
  isCustomer: Boolean,        // Flag khách hàng
  isSystem: Boolean,          // System permission (không thể xóa)
  permissions: {              // Chi tiết quyền CRUD
    products: { view, create, edit, delete },
    categories: { view, create, edit, delete },
    users: { view, create, edit, delete },
    orders: { view, create, edit, delete },
    coupons: { view, create, edit, delete },
    sales: { view, create, edit, delete },
    permissions: { view, create, edit, delete }
  },
  timestamps: true            // createdAt, updatedAt
}
```

---

## 📊 Phân Cấp Quyền Mặc Định

### 1. **Admin** (Level 100) 🔴
- **Mô tả**: Quản trị viên cao nhất
- **Quyền hạn**: Toàn quyền (CRUD tất cả modules)
- **Flags**: `isAdmin: true`, `isSystem: true`
- **Không thể**: Xóa hoặc thay đổi role type

### 2. **Nhân Viên** (Level 50) 🟡
- **Mô tả**: Nhân viên quản lý trung cấp
- **Quyền hạn**: 
  - Products: view, create, edit (không delete)
  - Orders: view, edit
  - Coupons: view, create, edit
- **Flags**: `isStaff: true`, `isSystem: true`

### 3. **Customer** (Level 10) 🔵
- **Mô tả**: Khách hàng/người dùng thông thường
- **Quyền hạn**: 
  - Products: view only
  - Orders: view, create
  - Coupons: view only
- **Flags**: `isCustomer: true`, `isSystem: true`

### 4. **Custom Roles** (Level 0+)
- Có thể tạo thêm các role tùy chỉnh
- Linh hoạt trong cấu hình permissions

---

## 🎨 Giao Diện Mới

### Trang Danh Sách Permission

#### Features:
- ✅ Hiển thị **description** cho mỗi permission
- ✅ **Badge cấp độ**: Cao nhất (đỏ), Trung bình (vàng), Thấp (xanh)
- ✅ **Badge loại**: Admin, Staff, Customer
- ✅ **User count**: Số người dùng đang sử dụng
- ✅ **System badge**: Đánh dấu quyền hệ thống
- ✅ **Protected delete**: Disable nút xóa nếu:
  - Là system permission
  - Có user đang sử dụng
- ✅ **Icons**: FontAwesome cho UI đẹp hơn

#### Table Columns:
| Tên quyền | Mô tả | Cấp độ | Loại | Người dùng | Hành động |
|-----------|-------|--------|------|------------|-----------|
| Admin 🔒  | Quản trị... | 🔴 Cao nhất | 🔴 Admin | 👥 5 | ✏️ 🚫 |

---

### Trang Create Permission

#### Features:
- ✅ **Tên quyền** với placeholder gợi ý
- ✅ **Mô tả** textarea để giải thích chi tiết
- ✅ **Level selector** với 4 options:
  - 0: Mặc định
  - 10: Thấp (Customer)
  - 50: Trung bình (Staff)
  - 100: Cao nhất (Admin)
- ✅ **Role checkboxes** với auto-level:
  - Check Admin → Level 100
  - Check Staff → Level 50
  - Check Customer → Level 10
- ✅ **Info box** với lưu ý quan trọng
- ✅ **Icons** cho mỗi field

---

### Trang Update Permission

#### Features:
- ✅ Tất cả features của Create
- ✅ **System warning**: Cảnh báo nếu là quyền hệ thống
- ✅ **User count warning**: Hiển thị số user đang dùng
- ✅ **Confirmation dialog**: Xác nhận trước khi update nếu có user
- ✅ **Detailed warnings**:
  - "Có X người dùng đang sử dụng"
  - "Thay đổi có thể ảnh hưởng đến quyền truy cập"
  - "Hãy thông báo cho người dùng trước"

---

## 🔒 Bảo Mật & Validation

### Backend Protection

#### 1. Delete Permission
```javascript
❌ Không thể xóa nếu:
  - isSystem === true
  - userCount > 0

✅ Message chi tiết:
  - "Không thể xóa quyền hệ thống"
  - "Có X người dùng đang sử dụng quyền này"
```

#### 2. Create/Update Permission
```javascript
✅ Validation:
  - Tên quyền không trùng (case-insensitive)
  - Tên >= 3 ký tự
  - Auto format: Title Case

✅ Error handling:
  - Try-catch wrapper
  - Detailed error messages
```

#### 3. API Improvements
```javascript
✅ Better queries:
  - MongoDB queries thay vì filter array
  - Pagination đúng với skip/limit
  - Sort by level & name

✅ User count:
  - Async count cho mỗi permission
  - Cached trong response
```

---

## 📦 Database Migration

### Tự Động Cập Nhật

Khi khởi động server, script sẽ tự động:

1. ✅ Tạo 3 permissions mặc định (Admin, Nhân Viên, Customer)
2. ✅ Cập nhật existing permissions với fields mới
3. ✅ Set `isSystem = true` cho 3 quyền chính
4. ✅ Assign đầy đủ permissions object

### Manual Migration (Nếu Cần)

```javascript
// Run in MongoDB shell or script
db.permission.updateMany(
  {},
  {
    $set: {
      description: "",
      level: 0,
      isAdmin: false,
      isStaff: false,
      isCustomer: false,
      isSystem: false,
      permissions: {
        products: { view: true, create: false, edit: false, delete: false },
        categories: { view: true, create: false, edit: false, delete: false },
        users: { view: false, create: false, edit: false, delete: false },
        orders: { view: false, create: false, edit: false, delete: false },
        coupons: { view: false, create: false, edit: false, delete: false },
        sales: { view: false, create: false, edit: false, delete: false },
        permissions: { view: false, create: false, edit: false, delete: false }
      }
    }
  }
)
```

---

## 🚀 Cách Sử Dụng

### 1. Tạo Permission Mới

```
Admin Panel → Permission → "Tạo quyền mới"

1. Nhập tên quyền (VD: "Editor", "Viewer")
2. Nhập mô tả chi tiết
3. Chọn cấp độ (hoặc check role để auto-set)
4. Check loại quyền (Admin/Staff/Customer)
5. Click "Tạo quyền"
```

### 2. Cập Nhật Permission

```
Admin Panel → Permission → Click nút "Edit" (✏️)

1. Sửa tên/mô tả/cấp độ
2. Thay đổi role flags
3. Xem warning nếu có user đang dùng
4. Confirm và update
```

### 3. Xóa Permission

```
Admin Panel → Permission → Click nút "Delete" (🗑️)

❌ Bị chặn nếu:
  - System permission (hiển thị "Hệ thống")
  - Có user đang dùng (hiển thị số lượng)

✅ Có thể xóa:
  - Custom permission
  - Không có user nào dùng
  - Confirm trước khi xóa
```

---

## 🎯 Use Cases

### Case 1: Thêm Manager Role

```
Tên: Manager
Mô tả: Quản lý cấp trung với quyền quản lý orders và products
Cấp độ: 75
Flags: None (custom role)
Permissions: 
  - Products: view, create, edit, delete
  - Orders: view, create, edit, delete
  - Coupons: view, create, edit
```

### Case 2: Thêm Warehouse Staff

```
Tên: Warehouse Staff
Mô tả: Nhân viên kho quản lý inventory
Cấp độ: 40
Flags: isStaff = true
Permissions:
  - Products: view, edit (chỉ stock)
  - Orders: view (chỉ delivery)
```

### Case 3: Thêm VIP Customer

```
Tên: VIP Customer
Mô tả: Khách hàng VIP với quyền đặc biệt
Cấp độ: 20
Flags: isCustomer = true
Permissions:
  - Products: view (all)
  - Orders: view, create (priority)
  - Coupons: view, use (exclusive)
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. System Permissions
- ⚠️ **KHÔNG được xóa** Admin, Nhân Viên, Customer
- ⚠️ Chỉ có thể update description và permissions detail
- ⚠️ Không thể thay đổi isSystem flag qua UI

### 2. User Impact
- ⚠️ Thay đổi level/permissions ảnh hưởng đến tất cả users
- ⚠️ Luôn check user count trước khi update
- ⚠️ Thông báo cho users trước khi thay đổi quyền lớn

### 3. Level Guidelines
- 100: Admin only
- 50-99: Management/Staff roles
- 10-49: Special customer roles
- 0-9: Basic/Guest roles

### 4. Best Practices
- ✅ Luôn có mô tả rõ ràng
- ✅ Set level phù hợp với quyền hạn
- ✅ Check role flags để dễ filter
- ✅ Test trước khi assign cho nhiều users
- ✅ Backup database trước khi migration

---

## 🐛 Troubleshooting

### 1. Không xóa được permission
**Nguyên nhân**: Có users đang sử dụng hoặc là system permission
**Giải pháp**: 
- Check user count
- Reassign users sang permission khác
- Hoặc giữ permission và disable users

### 2. Update không có effect
**Nguyên nhân**: Cache hoặc session cũ
**Giải pháp**:
- Logout/login lại
- Clear browser cache
- Restart server nếu cần

### 3. Permissions object không hoạt động
**Nguyên nhân**: Frontend chưa implement check permissions detail
**Giải pháp**: 
- Hiện tại chỉ dùng level và role flags
- Permissions object để mở rộng sau

---

## 📈 Tương Lai

### Planned Features

1. **Permission Templates**
   - Predefined templates cho common roles
   - Quick setup with templates

2. **Permission History**
   - Audit log cho mọi thay đổi
   - Who changed what when

3. **Role Assignment Wizard**
   - Bulk assign permissions to users
   - Preview before apply

4. **Advanced Permissions**
   - Time-based permissions
   - IP-based restrictions
   - Module-specific custom permissions

5. **Permission Testing**
   - Test mode để xem quyền trước khi apply
   - Simulation tool

---

## 📞 Support

Nếu có vấn đề hoặc câu hỏi:
1. Check documentation này
2. Check console logs
3. Test với permission đơn giản trước
4. Contact admin team

---

## 🎉 Kết Luận

Hệ thống phân quyền đã được nâng cấp toàn diện với:
- ✅ UI/UX chuyên nghiệp
- ✅ Validation và security tốt hơn
- ✅ Flexibility trong cấu hình
- ✅ Protection cho system data
- ✅ User-friendly warnings

**Happy Managing! 🚀**
