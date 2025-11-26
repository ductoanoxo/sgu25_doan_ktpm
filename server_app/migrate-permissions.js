/**
 * Migration Script: Update Permissions with New Schema
 * 
 * Chạy script này nếu cần update permissions manually
 * hoặc khi server không tự động migrate
 * 
 * Cách chạy:
 * node server_app/migrate-permissions.js
 */

const mongoose = require('mongoose');
const Permission = require('./Models/permission');
const Users = require('./Models/user');

// Database connection
const USER = 'toantra349';
const PASS = encodeURIComponent('toantoan123');
const DB = 'mydb';
const HOST = 'ktpm.dwb8wtz.mongodb.net';
const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/${DB}?retryWrites=true&w=majority`;

async function migratePermissions() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');

        // Get all existing permissions
        const existingPermissions = await Permission.find();
        console.log(`📊 Found ${existingPermissions.length} existing permissions\n`);

        // Update or create Admin permission
        console.log('🔧 Processing Admin permission...');
        let adminPerm = await Permission.findOne({ permission: 'Admin' });
        if (!adminPerm) {
            adminPerm = new Permission({
                permission: 'Admin',
                description: 'Quản trị viên cao nhất có toàn quyền truy cập hệ thống',
                level: 100,
                isAdmin: true,
                isStaff: false,
                isCustomer: false,
                isSystem: true,
                permissions: {
                    products: { view: true, create: true, edit: true, delete: true },
                    categories: { view: true, create: true, edit: true, delete: true },
                    users: { view: true, create: true, edit: true, delete: true },
                    orders: { view: true, create: true, edit: true, delete: true },
                    coupons: { view: true, create: true, edit: true, delete: true },
                    sales: { view: true, create: true, edit: true, delete: true },
                    permissions: { view: true, create: true, edit: true, delete: true }
                }
            });
            await adminPerm.save();
            console.log('  ✅ Created Admin permission');
        } else {
            adminPerm.description = adminPerm.description || 'Quản trị viên cao nhất có toàn quyền truy cập hệ thống';
            adminPerm.level = 100;
            adminPerm.isAdmin = true;
            adminPerm.isStaff = false;
            adminPerm.isCustomer = false;
            adminPerm.isSystem = true;
            if (!adminPerm.permissions) {
                adminPerm.permissions = {
                    products: { view: true, create: true, edit: true, delete: true },
                    categories: { view: true, create: true, edit: true, delete: true },
                    users: { view: true, create: true, edit: true, delete: true },
                    orders: { view: true, create: true, edit: true, delete: true },
                    coupons: { view: true, create: true, edit: true, delete: true },
                    sales: { view: true, create: true, edit: true, delete: true },
                    permissions: { view: true, create: true, edit: true, delete: true }
                };
            }
            await adminPerm.save();
            console.log('  ✅ Updated Admin permission');
        }
        const adminUserCount = await Users.countDocuments({ id_permission: adminPerm._id });
        console.log(`  👥 ${adminUserCount} users with Admin permission\n`);

        // Update or create Nhân Viên permission
        console.log('🔧 Processing Nhân Viên permission...');
        let staffPerm = await Permission.findOne({ permission: 'Nhân Viên' });
        if (!staffPerm) {
            staffPerm = new Permission({
                permission: 'Nhân Viên',
                description: 'Nhân viên quản lý có quyền hạn trung cấp',
                level: 50,
                isAdmin: false,
                isStaff: true,
                isCustomer: false,
                isSystem: true,
                permissions: {
                    products: { view: true, create: true, edit: true, delete: false },
                    categories: { view: true, create: false, edit: false, delete: false },
                    users: { view: true, create: false, edit: false, delete: false },
                    orders: { view: true, create: false, edit: true, delete: false },
                    coupons: { view: true, create: true, edit: true, delete: false },
                    sales: { view: true, create: false, edit: false, delete: false },
                    permissions: { view: true, create: false, edit: false, delete: false }
                }
            });
            await staffPerm.save();
            console.log('  ✅ Created Nhân Viên permission');
        } else {
            staffPerm.description = staffPerm.description || 'Nhân viên quản lý có quyền hạn trung cấp';
            staffPerm.level = 50;
            staffPerm.isAdmin = false;
            staffPerm.isStaff = true;
            staffPerm.isCustomer = false;
            staffPerm.isSystem = true;
            if (!staffPerm.permissions) {
                staffPerm.permissions = {
                    products: { view: true, create: true, edit: true, delete: false },
                    categories: { view: true, create: false, edit: false, delete: false },
                    users: { view: true, create: false, edit: false, delete: false },
                    orders: { view: true, create: false, edit: true, delete: false },
                    coupons: { view: true, create: true, edit: true, delete: false },
                    sales: { view: true, create: false, edit: false, delete: false },
                    permissions: { view: true, create: false, edit: false, delete: false }
                };
            }
            await staffPerm.save();
            console.log('  ✅ Updated Nhân Viên permission');
        }
        const staffUserCount = await Users.countDocuments({ id_permission: staffPerm._id });
        console.log(`  👥 ${staffUserCount} users with Nhân Viên permission\n`);

        // Update or create Customer permission
        console.log('🔧 Processing Customer permission...');
        let customerPerm = await Permission.findOne({ permission: 'Customer' });
        if (!customerPerm) {
            customerPerm = new Permission({
                permission: 'Customer',
                description: 'Khách hàng - người dùng thông thường của hệ thống',
                level: 10,
                isAdmin: false,
                isStaff: false,
                isCustomer: true,
                isSystem: true,
                permissions: {
                    products: { view: true, create: false, edit: false, delete: false },
                    categories: { view: true, create: false, edit: false, delete: false },
                    users: { view: false, create: false, edit: false, delete: false },
                    orders: { view: true, create: true, edit: false, delete: false },
                    coupons: { view: true, create: false, edit: false, delete: false },
                    sales: { view: true, create: false, edit: false, delete: false },
                    permissions: { view: false, create: false, edit: false, delete: false }
                }
            });
            await customerPerm.save();
            console.log('  ✅ Created Customer permission');
        } else {
            customerPerm.description = customerPerm.description || 'Khách hàng - người dùng thông thường của hệ thống';
            customerPerm.level = 10;
            customerPerm.isAdmin = false;
            customerPerm.isStaff = false;
            customerPerm.isCustomer = true;
            customerPerm.isSystem = true;
            if (!customerPerm.permissions) {
                customerPerm.permissions = {
                    products: { view: true, create: false, edit: false, delete: false },
                    categories: { view: true, create: false, edit: false, delete: false },
                    users: { view: false, create: false, edit: false, delete: false },
                    orders: { view: true, create: true, edit: false, delete: false },
                    coupons: { view: true, create: false, edit: false, delete: false },
                    sales: { view: true, create: false, edit: false, delete: false },
                    permissions: { view: false, create: false, edit: false, delete: false }
                };
            }
            await customerPerm.save();
            console.log('  ✅ Updated Customer permission');
        }
        const customerUserCount = await Users.countDocuments({ id_permission: customerPerm._id });
        console.log(`  👥 ${customerUserCount} users with Customer permission\n`);

        // Update other existing permissions with default values
        console.log('🔧 Processing other permissions...');
        const otherPermissions = await Permission.find({ 
            permission: { $nin: ['Admin', 'Nhân Viên', 'Customer'] } 
        });
        
        for (const perm of otherPermissions) {
            let updated = false;
            
            if (!perm.description) {
                perm.description = '';
                updated = true;
            }
            if (perm.level === undefined) {
                perm.level = 0;
                updated = true;
            }
            if (perm.isAdmin === undefined) {
                perm.isAdmin = false;
                updated = true;
            }
            if (perm.isStaff === undefined) {
                perm.isStaff = false;
                updated = true;
            }
            if (perm.isCustomer === undefined) {
                perm.isCustomer = false;
                updated = true;
            }
            if (perm.isSystem === undefined) {
                perm.isSystem = false;
                updated = true;
            }
            if (!perm.permissions) {
                perm.permissions = {
                    products: { view: true, create: false, edit: false, delete: false },
                    categories: { view: true, create: false, edit: false, delete: false },
                    users: { view: false, create: false, edit: false, delete: false },
                    orders: { view: false, create: false, edit: false, delete: false },
                    coupons: { view: false, create: false, edit: false, delete: false },
                    sales: { view: false, create: false, edit: false, delete: false },
                    permissions: { view: false, create: false, edit: false, delete: false }
                };
                updated = true;
            }
            
            if (updated) {
                await perm.save();
                const userCount = await Users.countDocuments({ id_permission: perm._id });
                console.log(`  ✅ Updated "${perm.permission}" permission (${userCount} users)`);
            }
        }

        // Summary
        console.log('\n📊 Migration Summary:');
        const finalPermissions = await Permission.find();
        console.log(`  Total permissions: ${finalPermissions.length}`);
        console.log(`  System permissions: ${finalPermissions.filter(p => p.isSystem).length}`);
        console.log(`  Custom permissions: ${finalPermissions.filter(p => !p.isSystem).length}`);
        
        const totalUsers = await Users.countDocuments();
        console.log(`  Total users: ${totalUsers}`);

        console.log('\n✅ Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run migration
migratePermissions();
