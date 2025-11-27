// Models/permission.js
const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    permission: { 
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    level: {
        type: Number,
        default: 0,
        // 100: Admin (highest), 50: Staff, 10: Customer (lowest)
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isStaff: {
        type: Boolean,
        default: false
    },
    isCustomer: {
        type: Boolean,
        default: false
    },
    isSystem: {
        type: Boolean,
        default: false,
        // System permissions cannot be deleted
    },
    permissions: {
        type: Object,
        default: {
            // Default permissions cho tất cả roles
            // Staff sẽ được override khi tạo
            products: { view: true, create: false, edit: false, delete: false },
            categories: { view: true, create: false, edit: false, delete: false },
            users: { view: false, create: false, edit: false, delete: false },
            orders: { view: false, create: false, edit: false, delete: false },
            coupons: { view: false, create: false, edit: false, delete: false },
            sales: { view: false, create: false, edit: false, delete: false },
            permissions: { view: false, create: false, edit: false, delete: false }
        }
    }
}, {
    timestamps: true
});

// Index for faster queries
permissionSchema.index({ permission: 1 });
permissionSchema.index({ level: -1 });

// Virtual for user count (will be populated separately)
permissionSchema.virtual('userCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'id_permission',
    count: true
});

const Permission = mongoose.model('Permission', permissionSchema, 'permission');

module.exports = Permission;