const User = require('../../../Models/user');
const Permission = require('../../../Models/permission');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.index = async(req, res) => {
    try {
        console.log('\n========== USER INDEX REQUEST ==========');
        console.log('📥 Query params:', req.query);
        
        let page = parseInt(req.query.page) || 1;
        const keyWordSearch = req.query.search;

        const perPage = parseInt(req.query.limit) || 8;
        
        let users;
        let query = {};
        
        // Nếu có filter permission cụ thể
        if (req.query.permission) {
            query.id_permission = req.query.permission;
        }
        
        // Nếu chỉ muốn lấy customers - tìm customer permission động
        if (req.query.customerOnly === 'true') {
            console.log('🔍 Tìm kiếm customer permission...');
            const customerPerm = await Permission.findOne({ isCustomer: true });
            console.log('✅ Customer permission tìm thấy:', customerPerm);
            if (customerPerm) {
                query.id_permission = customerPerm._id;
                console.log('📝 Query filter cho customers:', query);
            } else {
                console.log('⚠️ KHÔNG tìm thấy permission có isCustomer: true');
            }
        }
        
        // Nếu muốn loại trừ customers (chỉ lấy admin/staff)
        if (req.query.excludeCustomer === 'true') {
            // Tìm tất cả permissions là Admin hoặc Staff
            const adminStaffPerms = await Permission.find({ 
                $or: [
                    { isAdmin: true },
                    { isStaff: true }
                ]
            });
            
            // Lấy danh sách IDs
            const permIds = adminStaffPerms.map(p => p._id);
            
            // Chỉ lấy users có permission trong danh sách Admin/Staff (loại bỏ null và Customer)
            if (permIds.length > 0) {
                query.id_permission = { $in: permIds };
            }
        }
        
        // Lọc theo search nếu có
        if (keyWordSearch) {
            users = await User.find(query).populate('id_permission');
            console.log(`🔎 Tìm thấy ${users.length} users với query:`, query);
            users = users.filter(value => {
                return value.fullname.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
                    value.username.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1;
            });
        } else {
            users = await User.find(query).populate('id_permission');
            console.log(`🔎 Tìm thấy ${users.length} users với query:`, query);
        }
    
        const totalPage = Math.ceil(users.length / perPage);
        let start = (page - 1) * perPage;
        let end = page * perPage;

        console.log(`📤 Trả về ${users.slice(start, end).length} users (từ ${users.length} users tổng)`);
        console.log('========================================\n');

        res.json({
            users: users.slice(start, end),
            totalPage: totalPage,
            total: users.length
        });
    
    } catch (error) {
        console.error('Error in user.index:', error);
        res.status(500).json({ msg: 'Lỗi server', error: error.message });
    }
};

module.exports.create = async(req, res) => {
    try {
        const user = await User.find();

        const userFilter = user.filter((c) => {
            return c.email === req.query.email.trim() || c.username === req.query.username.trim();
        });

        if (userFilter.length > 0) {
            res.json({ msg: 'Email hoặc username đã tồn tại' });
        } else {
            var newUser = new User();
            const salt = await bcrypt.genSalt();
            req.query.password = await bcrypt.hash(req.query.password, salt);
            req.query.name = req.query.name.toLowerCase().replace(/^.|\s\S/g, a => { return a.toUpperCase(); });
            newUser.fullname = req.query.name;
            newUser.username = req.query.username;
            newUser.password = req.query.password;
            newUser.email = req.query.email;
            
            // Fix logic permission - tìm customer permission động
            if (req.query.permission) {
                newUser.id_permission = req.query.permission;
            } else {
                const customerPerm = await Permission.findOne({ isCustomer: true });
                if (customerPerm) {
                    newUser.id_permission = customerPerm._id;
                }
            }

            newUser.save();
            res.json({ msg: 'Bạn đã thêm thành công' });
        }
    } catch (error) {
        console.error('Error in user.create:', error);
        res.status(500).json({ msg: 'Lỗi server', error: error.message });
    }
};

module.exports.delete = async(req, res) => {
    const id = req.query.id;

    await User.deleteOne({ _id: id }, (err) => {
        if (err) {
            res.json({ msg: err });
            return;
        }
        res.json({ msg: 'Thanh Cong' });
    });

};

module.exports.details = async(req, res) => {
    const user = await User.findOne({ _id: req.params.id });

    res.json(user);
};

module.exports.update = async(req, res) => {
    const user = await User.findOne({ _id: req.query.id });
    if (req.query.email && req.query.email !== user.email) {
        req.query.email = user.email;
    }
    if (req.query.username && req.query.username !== user.username) {
        req.query.username = user.username;
    }
    if (!req.query.password) {
        req.query.password = user.password;
    } else {
        const salt = await bcrypt.genSalt();
        req.query.password = await bcrypt.hash(req.query.password, salt);
    }

    req.query.name = req.query.name.toLowerCase().replace(/^.|\s\S/g, a => { return a.toUpperCase(); });
    await User.updateOne({ _id: req.query.id }, {
        fullname: req.query.name,
        password: req.query.password,
        id_permission: req.query.permission
    }, function(err, res) {
        if (err) return res.json({ msg: err });
    });
    res.json({ msg: 'Bạn đã update thành công' });
};

module.exports.login = async(req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    const body = [{ username: email }, { email: email }];

    const user = await User.findOne({ $or: body }).populate('id_permission');

    if (user === null) {
        res.json({ msg: 'Không Tìm Thấy User' });
    } else {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            var token = jwt.sign(user._id.toJSON(), 'gfdgfd');
            res.json({ msg: 'Đăng nhập thành công', user: user, jwt: token });
        } else {
            res.json({ msg: 'Sai mật khẩu' });
        }
    }
};