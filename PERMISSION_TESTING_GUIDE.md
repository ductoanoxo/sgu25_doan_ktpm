# 🧪 Testing Guide - Permission System Upgrade

## Quick Start Testing

### 1. Start Backend
```bash
cd server_app
npm start
```

**Expected output:**
```
✅ Kết nối MongoDB Atlas
🌱 Permission 'Admin' đã được tạo với đầy đủ quyền
  hoặc
✅ Cập nhật permission Admin thành system permission
🌱 Permission 'Nhân Viên' đã được tạo
🌱 Permission 'Customer' đã được tạo
```

### 2. Start Frontend Admin
```bash
cd admin_app
npm start
```

### 3. Login Admin
```
URL: http://localhost:3001/
Username: admin
Password: 123456
```

### 4. Navigate to Permission Page
```
Left Menu → Permission
hoặc
URL: http://localhost:3001/permission
```

---

## ✅ Test Cases

### Test 1: View Permission List ✓

**Steps:**
1. Go to `/permission`
2. Check table columns

**Expected:**
- ✅ 6 columns: Tên quyền, Mô tả, Cấp độ, Loại, Người dùng, Hành động
- ✅ Admin row with:
  - 🔒 "Hệ thống" badge
  - 🔴 "Cao nhất" badge
  - 🔴 "Admin" badge
  - 👥 User count (at least 1)
  - ✏️ Edit button enabled
  - 🗑️ Delete button DISABLED
- ✅ Other permissions displayed correctly

---

### Test 2: Create New Permission ✓

**Steps:**
1. Click "Tạo quyền mới"
2. Enter:
   - Tên: `Manager`
   - Mô tả: `Quản lý cấp trung với quyền cao`
   - Check "Nhân viên" checkbox
3. Submit

**Expected:**
- ✅ Level auto-set to 50
- ✅ Success message appears
- ✅ Redirect or stay with cleared form
- ✅ New permission appears in list
- ✅ Badge "Nhân viên" shown
- ✅ Level badge "Trung bình" shown
- ✅ User count = 0

---

### Test 3: Update Permission ✓

**Steps:**
1. Click Edit on "Manager" permission
2. Change description
3. Change level to 75
4. Click "Cập nhật"

**Expected:**
- ✅ Form loaded with existing data
- ✅ No warning (because 0 users)
- ✅ Success message after update
- ✅ List shows updated data

---

### Test 4: Update Permission with Users ⚠️

**Steps:**
1. Assign "Manager" to a user (via User page)
2. Edit "Manager" permission
3. Try to change level to 100
4. Click "Cập nhật"

**Expected:**
- ✅ Form shows warning: "Có X người dùng đang sử dụng"
- ✅ Confirmation dialog appears:
  - "CẢNH BÁO: Có X người dùng..."
  - "Thay đổi có thể ảnh hưởng..."
- ✅ Can cancel or proceed
- ✅ If proceed → Success message

---

### Test 5: Try Delete System Permission 🚫

**Steps:**
1. Try to click Delete on "Admin" row
2. Check button state

**Expected:**
- ✅ Delete button is DISABLED (grey)
- ✅ Hover shows tooltip: "Không thể xóa quyền hệ thống"
- ✅ Button has `disabled` attribute

---

### Test 6: Try Delete Permission with Users 🚫

**Steps:**
1. Delete button on permission with users > 0
2. Click Delete

**Expected:**
- ✅ Delete button is enabled but different color (maybe grey/warning)
- ✅ Confirmation dialog: "Có X người dùng..."
- ✅ After confirm → Error message:
  - "Không thể xóa. Có X người dùng đang sử dụng quyền này."
- ✅ Permission NOT deleted
- ✅ Error message auto-hide after 5s

---

### Test 7: Delete Unused Custom Permission ✅

**Steps:**
1. Create new permission "Test Permission"
2. Don't assign to any user
3. Click Delete
4. Confirm

**Expected:**
- ✅ Confirmation dialog
- ✅ Permission deleted successfully
- ✅ Disappears from list
- ✅ No error message

---

### Test 8: Search Permissions 🔍

**Steps:**
1. Type "Admin" in search box
2. Wait/Press enter

**Expected:**
- ✅ Only "Admin" permission shown
- ✅ Search works on name
- ✅ Search works on description (if contains "admin")

---

### Test 9: Pagination 📄

**Steps:**
1. Create multiple permissions (> 4)
2. Check pagination

**Expected:**
- ✅ Shows 4 items per page
- ✅ Pagination controls visible
- ✅ Can navigate pages
- ✅ Data changes when page changes

---

### Test 10: Role Auto-Level ⚡

**Steps:**
1. Create → Check "Admin" checkbox

**Expected:**
- ✅ Level auto-set to 100
- ✅ Other checkboxes auto-unchecked

**Steps:**
2. Uncheck "Admin" → Check "Nhân viên"

**Expected:**
- ✅ Level auto-set to 50
- ✅ Admin checkbox auto-unchecked

**Steps:**
3. Uncheck "Nhân viên" → Check "Khách hàng"

**Expected:**
- ✅ Level auto-set to 10
- ✅ Staff checkbox auto-unchecked

---

## 🐛 Known Issues to Check

### Issue 1: Font Awesome Icons
**Symptom:** Icons không hiển thị, chỉ thấy boxes
**Fix:** Check if FontAwesome loaded in HTML
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
```

### Issue 2: Badges không màu
**Symptom:** Badges trắng hoặc không style
**Fix:** Check Bootstrap CSS loaded

### Issue 3: Checkbox không hoạt động
**Symptom:** Check nhưng không auto-set level
**Fix:** Check console for JS errors

---

## 📊 Expected Data After Migration

### Admin Permission
```javascript
{
  permission: "Admin",
  description: "Quản trị viên cao nhất...",
  level: 100,
  isAdmin: true,
  isStaff: false,
  isCustomer: false,
  isSystem: true,
  userCount: 1+ // At least admin user
}
```

### Nhân Viên Permission
```javascript
{
  permission: "Nhân Viên",
  description: "Nhân viên quản lý...",
  level: 50,
  isAdmin: false,
  isStaff: true,
  isCustomer: false,
  isSystem: true,
  userCount: 0+
}
```

### Customer Permission
```javascript
{
  permission: "Customer",
  description: "Khách hàng - người dùng...",
  level: 10,
  isAdmin: false,
  isStaff: false,
  isCustomer: true,
  isSystem: true,
  userCount: 0+
}
```

---

## 🔧 Troubleshooting

### Problem: Permissions không migrate
**Solution:**
```bash
cd server_app
node migrate-permissions.js
```

### Problem: Frontend không hiển thị data mới
**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+F5)
3. Check Network tab for API response
4. Check Console for errors

### Problem: API error 500
**Solution:**
1. Check server console logs
2. Check MongoDB connection
3. Restart server
4. Check Models/permission.js syntax

### Problem: Delete không work
**Solution:**
1. Check user count > 0 → Cannot delete
2. Check isSystem = true → Cannot delete
3. Check console for error response

---

## ✅ Final Checklist

Before marking as complete:

- [ ] Backend starts without errors
- [ ] 3 system permissions created
- [ ] Permission list page displays correctly
- [ ] All badges show with colors
- [ ] Icons display (not boxes)
- [ ] Create permission works
- [ ] Update permission works
- [ ] Delete protection works
- [ ] User count displays correctly
- [ ] Search works
- [ ] Pagination works
- [ ] No console errors
- [ ] No API errors in Network tab

---

## 📸 Screenshots to Take

1. Permission List with all badges
2. Create Permission form
3. Update Permission with warning
4. Delete confirmation dialog
5. System permission with disabled delete

---

**Happy Testing! 🚀**
