const Permission = require('../../../Models/permission');
const Users = require('../../../Models/user');

module.exports.index = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        const keyWordSearch = req.query.search;
        const perPage = parseInt(req.query.limit) || 8;
        
        let query = {};
        if (keyWordSearch) {
            query.$or = [
                { permission: { $regex: keyWordSearch, $options: 'i' } },
                { description: { $regex: keyWordSearch, $options: 'i' } }
            ];
        }

        const totalCount = await Permission.countDocuments(query);
        const totalPage = Math.ceil(totalCount / perPage);

        let start = (page - 1) * perPage;

        const permissions = await Permission.find(query)
            .sort({ level: -1, permission: 1 })
            .skip(start)
            .limit(perPage)
            .lean();

        // Get user count for each permission
        const permissionsWithCount = await Promise.all(
            permissions.map(async (perm) => {
                const userCount = await Users.countDocuments({ id_permission: perm._id });
                return {
                    ...perm,
                    userCount
                };
            })
        );

        res.json({
            permission: permissionsWithCount,
            totalPage: totalPage,
            currentPage: page,
            totalCount: totalCount
        });
    } catch (error) {
        console.error('Error in permission.index:', error);
        res.status(500).json({ msg: 'Lỗi server', error: error.message });
    }
};

module.exports.all = async (req, res) => {
    try {
        const permissions = await Permission.find()
            .sort({ level: -1, permission: 1 })
            .lean();

        // Optionally include user count
        if (req.query.includeCount === 'true') {
            const permissionsWithCount = await Promise.all(
                permissions.map(async (perm) => {
                    const userCount = await Users.countDocuments({ id_permission: perm._id });
                    return {
                        ...perm,
                        userCount
                    };
                })
            );
            res.json(permissionsWithCount);
        } else {
            res.json(permissions);
        }
    } catch (error) {
        console.error('Error in permission.all:', error);
        res.status(500).json({ msg: 'Lỗi server', error: error.message });
    }
};

module.exports.create = async (req, res) => {
    try {
        const { name, description, level, isAdmin, isStaff, isCustomer, permissions } = req.query;

        if (!name || !name.trim()) {
            return res.json({ msg: 'Tên quyền không được để trống' });
        }

        // Check if permission already exists
        const existingPermission = await Permission.findOne({ 
            permission: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
        });

        if (existingPermission) {
            return res.json({ msg: 'Quyền đã tồn tại' });
        }

        // Format permission name
        const formattedName = name.trim().toLowerCase().replace(/^.|\s\S/g, a => a.toUpperCase());

        const newPermission = new Permission({
            permission: formattedName,
            description: description || '',
            level: parseInt(level) || 0,
            isAdmin: isAdmin === 'true',
            isStaff: isStaff === 'true',
            isCustomer: isCustomer === 'true',
            isSystem: false
        });

        if (permissions) {
            try {
                newPermission.permissions = JSON.parse(permissions);
            } catch (e) {
                console.error('Error parsing permissions:', e);
            }
        }

        await newPermission.save();
        res.json({ msg: 'Bạn đã thêm thành công' });
    } catch (error) {
        console.error('Error in permission.create:', error);
        res.status(500).json({ msg: 'Lỗi server', error: error.message });
    }
};

module.exports.delete = async (req, res) => {
    try {
        const id = req.query.id;

        if (!id) {
            return res.json({ msg: 'ID không hợp lệ' });
        }

        // Check if permission exists
        const permission = await Permission.findById(id);
        if (!permission) {
            return res.json({ msg: 'Quyền không tồn tại' });
        }

        // Check if it's a system permission
        if (permission.isSystem) {
            return res.json({ msg: 'Không thể xóa quyền hệ thống' });
        }

        // Check if any users are using this permission
        const userCount = await Users.countDocuments({ id_permission: id });
        if (userCount > 0) {
            return res.json({ 
                msg: `Không thể xóa. Có ${userCount} người dùng đang sử dụng quyền này.`,
                userCount: userCount
            });
        }

        await Permission.deleteOne({ _id: id });
        res.json({ msg: 'Thanh Cong' });
    } catch (error) {
        console.error('Error in permission.delete:', error);
        res.status(500).json({ msg: 'Lỗi server', error: error.message });
    }
};

module.exports.details = async (req, res) => {
    try {
        const permission = await Permission.findOne({ _id: req.params.id }).lean();
        
        if (!permission) {
            return res.status(404).json({ msg: 'Quyền không tồn tại' });
        }

        // Get user count
        const userCount = await Users.countDocuments({ id_permission: permission._id });

        res.json({
            ...permission,
            userCount
        });
    } catch (error) {
        console.error('Error in permission.details:', error);
        res.status(500).json({ msg: 'Lỗi server', error: error.message });
    }
};

module.exports.update = async (req, res) => {
    try {
        const { id, name, description, level, isAdmin, isStaff, isCustomer, permissions } = req.query;

        if (!id) {
            return res.json({ msg: 'ID không hợp lệ' });
        }

        if (!name || !name.trim()) {
            return res.json({ msg: 'Tên quyền không được để trống' });
        }

        // Check if permission exists
        const currentPermission = await Permission.findById(id);
        if (!currentPermission) {
            return res.json({ msg: 'Quyền không tồn tại' });
        }

        // Check if new name conflicts with existing permission (excluding current one)
        const existingPermission = await Permission.findOne({ 
            permission: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            _id: { $ne: id }
        });

        if (existingPermission) {
            return res.json({ msg: 'Quyền đã tồn tại' });
        }

        // Format permission name
        const formattedName = name.trim().toLowerCase().replace(/^.|\s\S/g, a => a.toUpperCase());

        const updateData = {
            permission: formattedName,
            description: description || currentPermission.description,
            level: level !== undefined ? parseInt(level) : currentPermission.level,
            isAdmin: isAdmin === 'true',
            isStaff: isStaff === 'true',
            isCustomer: isCustomer === 'true'
        };

        if (permissions) {
            try {
                updateData.permissions = JSON.parse(permissions);
            } catch (e) {
                console.error('Error parsing permissions:', e);
            }
        }

        await Permission.updateOne({ _id: id }, updateData);
        res.json({ msg: 'Bạn đã update thành công' });
    } catch (error) {
        console.error('Error in permission.update:', error);
        res.status(500).json({ msg: 'Lỗi server', error: error.message });
    }
};