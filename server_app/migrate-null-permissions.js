require('dotenv').config();
const mongoose = require('mongoose');
const Users = require('./Models/user');
const Permission = require('./Models/permission');

const USER = 'toantra349';
const PASS = encodeURIComponent('toantoan123');
const DB = 'mydb';
const HOST = 'ktpm.dwb8wtz.mongodb.net';

const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/${DB}?retryWrites=true&w=majority`;

console.log('🔌 Kết nối đến MongoDB Atlas...');

mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(async() => {
        console.log('✅ Đã kết nối MongoDB Atlas');

        // Tìm Customer permission
        const customerPerm = await Permission.findOne({ isCustomer: true });
        if (!customerPerm) {
            console.log('❌ Không tìm thấy Customer permission!');
            process.exit(1);
        }

        console.log(`✅ Tìm thấy Customer permission: ${customerPerm._id}`);

        // Lấy tất cả permission IDs hợp lệ
        const allPerms = await Permission.find({});
        const validPermIds = allPerms.map(p => p._id.toString());
        console.log(`📋 Có ${allPerms.length} permissions hợp lệ: ${validPermIds.join(', ')}`);

        // Tìm tất cả users
        const allUsers = await Users.find({});
        console.log(`📊 Tổng số users: ${allUsers.length}`);

        // Lọc users có permission null hoặc không hợp lệ
        const usersWithoutValidPerm = allUsers.filter(user => {
            if (!user.id_permission) return true; // null
            const permIdStr = user.id_permission.toString();
            return !validPermIds.includes(permIdStr); // permission không tồn tại
        });
        
        console.log(`📊 Tìm thấy ${usersWithoutValidPerm.length} users không có permission hợp lệ`);

        // Cập nhật tất cả
        let count = 0;
        for (let user of usersWithoutValidPerm) {
            user.id_permission = customerPerm._id;
            await user.save();
            count++;
            console.log(`  ✅ ${count}/${usersWithoutValidPerm.length} - Cập nhật user: ${user.username} → Customer`);
        }

        console.log(`\n✅ Hoàn tất! Đã cập nhật ${count} users`);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Lỗi:', err);
        process.exit(1);
    });
