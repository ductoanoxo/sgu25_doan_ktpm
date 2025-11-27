// update-staff-permissions.js
// Script để cập nhật permissions cho Staff role theo yêu cầu

const mongoose = require('mongoose');
const Permission = require('./Models/permission');

// Kết nối MongoDB
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/SGU_DOAN_SHOP';

async function updateStaffPermissions() {
    try {
        console.log('🔄 Đang kết nối MongoDB...');
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Đã kết nối MongoDB');

        // Tìm Staff permission
        const staffPerm = await Permission.findOne({ 
            $or: [
                { isStaff: true },
                { permission: "Nhân Viên" },
                { permission: "Staff" }
            ]
        });

        if (!staffPerm) {
            console.log('⚠️ KHÔNG tìm thấy Staff permission. Tạo mới...');
            
            const newStaffPerm = await Permission.create({
                permission: "Nhân Viên",
                description: "Nhân viên quản lý sản phẩm, đơn hàng và mã giảm giá",
                level: 50,
                isAdmin: false,
                isStaff: true,
                isCustomer: false,
                isSystem: true,
                permissions: {
                    // Products - View, Create, Edit (KHÔNG Delete)
                    products: { view: true, create: true, edit: true, delete: false },
                    
                    // Categories - CHỈ View
                    categories: { view: true, create: false, edit: false, delete: false },
                    
                    // Users - CHỈ View
                    users: { view: true, create: false, edit: false, delete: false },
                    
                    // Orders - View và Edit (xử lý đơn), KHÔNG Create/Delete
                    orders: { view: true, create: false, edit: true, delete: false },
                    
                    // Coupons - View, Create, Edit (KHÔNG Delete)
                    coupons: { view: true, create: true, edit: true, delete: false },
                    
                    // Sales - CHỈ View
                    sales: { view: true, create: false, edit: false, delete: false },
                    
                    // Permissions - CHỈ View
                    permissions: { view: true, create: false, edit: false, delete: false }
                }
            });

            console.log('✅ Đã tạo Staff permission mới:', newStaffPerm);
        } else {
            console.log('📝 Tìm thấy Staff permission:', staffPerm.permission);
            console.log('🔧 Đang cập nhật permissions...');

            // Cập nhật permissions theo yêu cầu
            staffPerm.permissions = {
                // Products - View, Create, Edit (KHÔNG Delete)
                products: { view: true, create: true, edit: true, delete: false },
                
                // Categories - CHỈ View
                categories: { view: true, create: false, edit: false, delete: false },
                
                // Users - CHỈ View
                users: { view: true, create: false, edit: false, delete: false },
                
                // Orders - View và Edit (xử lý đơn), KHÔNG Create/Delete
                orders: { view: true, create: false, edit: true, delete: false },
                
                // Coupons - View, Create, Edit (KHÔNG Delete)
                coupons: { view: true, create: true, edit: true, delete: false },
                
                // Sales - CHỈ View
                sales: { view: true, create: false, edit: false, delete: false },
                
                // Permissions - CHỈ View
                permissions: { view: true, create: false, edit: false, delete: false }
            };

            // Đảm bảo flags đúng
            staffPerm.isStaff = true;
            staffPerm.isAdmin = false;
            staffPerm.isCustomer = false;
            staffPerm.isSystem = true;
            staffPerm.level = 50;
            staffPerm.description = "Nhân viên quản lý sản phẩm, đơn hàng và mã giảm giá";

            await staffPerm.save();
            console.log('✅ Đã cập nhật Staff permissions thành công!');
        }

        // Hiển thị kết quả cuối cùng
        const finalStaffPerm = await Permission.findOne({ isStaff: true });
        console.log('\n📋 Staff Permissions hiện tại:');
        console.log(JSON.stringify(finalStaffPerm.permissions, null, 2));

        console.log('\n✨ Hoàn tất!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

// Chạy script
updateStaffPermissions();
