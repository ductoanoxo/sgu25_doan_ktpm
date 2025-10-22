const Users = require('../../Models/user')
const bcrypt = require('bcryptjs');

module.exports.index = async(req, res) => {

    const user = await Users.find()

    res.json(user)

}

module.exports.user = async(req, res) => {

    const id = req.params.id

    const user = await Users.findOne({ _id: id })

    res.json(user)

}

module.exports.detail = async(req, res) => {

    const username = req.query.username

    const password = req.query.password

    const query = [{ username: username }, { email: username }]

    const user = await Users.findOne({ $or: query })

    if (user === null) {
        res.send("Khong Tìm Thấy User")
    } else {
        if (user.password === password) {
            res.json(user)
        } else {
            res.send("Sai Mat Khau")
        }
    }

}

module.exports.post_user = async(req, res) => {

    const user = await Users.findOne({ username: req.body.username })

    if (user) {
        res.send("User Da Ton Tai")
    } else {
        await Users.create(req.body)
    }

    res.send("Thanh Cong")

}

module.exports.update_user = async(req, res) => {

    const user = await Users.findOne({ _id: req.body._id })

    user.fullname = req.body.fullname
    user.username = req.body.username
    user.password = req.body.password

    user.save()

    res.json("Thanh Cong")

}
module.exports.changePassword = async(req, res) => {
    const { _id, old_password, new_password } = req.body;

    try {
        const user = await Users.findById(_id);
        if (!user)
            return res.json({ success: false, message: 'User not found' });

        // 🔐 Nếu mật khẩu trong DB là bcrypt hash
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch)
            return res.json({ success: false, message: 'Mật khẩu cũ không đúng!' });

        // 🔐 Hash mật khẩu mới trước khi lưu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        user.password = hashedPassword;
        await user.save();

        return res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
    } catch (err) {
        console.error('Error in changePassword:', err);
        return res.json({ success: false, message: 'Lỗi server!' });
    }
};