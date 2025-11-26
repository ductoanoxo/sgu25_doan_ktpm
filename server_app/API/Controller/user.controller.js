const Users = require('../../Models/user');
const Permission = require('../../Models/permission');
const bcrypt = require('bcryptjs');  // Thêm bcrypt


module.exports.index = async(req, res) => {

    const user = await Users.find();

    res.json(user);

};

module.exports.user = async(req, res) => {

    const id = req.params.id;

    // Validate ObjectId format to prevent crashes
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: 'ID không hợp lệ' });
    }

    const user = await Users.findOne({ _id: id });

    res.json(user);

};

module.exports.detail = async(req, res) => {

    const username = req.query.username;
    const password = req.query.password;

    console.log('=== LOGIN DEBUG ===');
    console.log('Username/Email nhận được:', username);
    console.log('Password nhận được:', password);

    const query = [{ username: username }, { email: username }];

    const user = await Users.findOne({ $or: query });

    console.log('User tìm được:', user ? `${user.username} (${user.email})` : 'null');
    if (user) {
        console.log('Password trong DB:', user.password);
        console.log('Password type:', typeof user.password);
        console.log('Is password hashed?', user.password.startsWith('$2a$') || user.password.startsWith('$2b$'));
    }

    if (user === null) {
        console.log('Không tìm thấy user');
        res.send('Khong Tìm Thấy User');
    } else {
        // Kiểm tra xem password có được mã hóa bcrypt không
        const isPasswordHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
        
        let isPasswordCorrect = false;
        
        if (isPasswordHashed) {
            // Nếu password đã được mã hóa, dùng bcrypt.compare
            console.log('Sử dụng bcrypt.compare');
            isPasswordCorrect = await bcrypt.compare(password, user.password);
        } else {
            // Nếu password chưa được mã hóa, so sánh trực tiếp
            console.log('Sử dụng so sánh trực tiếp');
            isPasswordCorrect = (user.password === password);
        }
        
        console.log('Kết quả kiểm tra password:', isPasswordCorrect);
        
        if (isPasswordCorrect) {
            console.log('Đăng nhập thành công');
            res.json(user);
        } else {
            console.log('Sai mật khẩu');
            res.send('Sai Mat Khau');
        }
    }

};

module.exports.post_user = async(req, res) => {

    const user = await Users.findOne({ username: req.body.username });

    if (user) {
        return res.send('User Da Ton Tai');
    } else {
        // Hash mật khẩu trước khi lưu
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        let assignedPermission = null;

        if (req.body.id_permission) {
            const requestedPermission = await Permission.findById(req.body.id_permission);
            if (requestedPermission) {
                assignedPermission = requestedPermission._id;
            }
        }

        if (!assignedPermission) {
            const customerPerm = await Permission.findOne({ isCustomer: true });
            if (!customerPerm) {
                return res.status(500).send('Missing customer permission');
            }
            assignedPermission = customerPerm._id;
        }

        // Tạo object user mới với mật khẩu đã được hash
        const newUserData = {
            ...req.body,
            password: hashedPassword,
            id_permission: assignedPermission
        };
        
        await Users.create(newUserData);
        return res.send('Thanh Cong');
    }

};

module.exports.update_user = async(req, res) => {

    // Validate ObjectId format
    if (req.body._id && !req.body._id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: 'ID không hợp lệ' });
    }

    const user = await Users.findOne({ _id: req.body._id });

    if (!user) {
        return res.status(404).json({ msg: 'Không tìm thấy user' });
    }

    user.fullname = req.body.fullname;
    user.username = req.body.username;
    
    // Hash mật khẩu mới nếu có thay đổi
    if (req.body.password) {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();

    res.json('Thanh Cong');

};

module.exports.change_password = async(req, res) => {
    
    const { userId, oldPassword, newPassword } = req.body;

    console.log('=== CHANGE PASSWORD DEBUG ===');
    console.log('User ID:', userId);
    console.log('Old Password:', oldPassword);
    console.log('New Password:', newPassword);

    try {
        // Tìm user
        const user = await Users.findOne({ _id: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        console.log('User found:', user.username);
        console.log('Current password in DB:', user.password);

        // Kiểm tra mật khẩu cũ
        const isPasswordHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
        let isOldPasswordCorrect = false;
        
        if (isPasswordHashed) {
            // Nếu password đã được mã hóa, dùng bcrypt.compare
            console.log('Checking with bcrypt.compare');
            isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        } else {
            // Nếu password chưa được mã hóa, so sánh trực tiếp
            console.log('Checking with direct compare');
            isOldPasswordCorrect = (user.password === oldPassword);
        }

        console.log('Old password correct:', isOldPasswordCorrect);

        if (!isOldPasswordCorrect) {
            return res.json({ success: false, message: 'Mật khẩu cũ không đúng' });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt();
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        console.log('New hashed password:', hashedNewPassword);

        // Cập nhật mật khẩu mới
        user.password = hashedNewPassword;
        await user.save();

        console.log('Password updated successfully');

        res.json({ success: true, message: 'Đổi mật khẩu thành công' });

    } catch (error) {
        console.error('Error changing password:', error);
        res.json({ success: false, message: 'Có lỗi xảy ra khi đổi mật khẩu' });
    }

};
