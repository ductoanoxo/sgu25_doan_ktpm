// utils/permissionHelper.js
// Helper functions để kiểm tra quyền hạn của user

/**
 * Kiểm tra xem user có phải Admin không
 * @param {Object} user - User object từ context
 * @returns {boolean}
 */
export const isAdmin = (user) => {
    if (!user || !user.id_permission) return false;
    const perm = user.id_permission;
    return perm.isAdmin === true || perm.permission === "Admin";
};

/**
 * Kiểm tra xem user có phải Staff không
 * @param {Object} user - User object từ context
 * @returns {boolean}
 */
export const isStaff = (user) => {
    if (!user || !user.id_permission) return false;
    const perm = user.id_permission;
    return perm.isStaff === true || perm.permission === "Nhân Viên";
};

/**
 * Kiểm tra quyền cho một resource cụ thể
 * @param {Object} user - User object từ context
 * @param {string} resource - Tên resource (products, categories, users, orders, coupons, sales, permissions)
 * @param {string} action - Hành động (view, create, edit, delete)
 * @returns {boolean}
 */
export const hasPermission = (user, resource, action) => {
    // Admin có full quyền
    if (isAdmin(user)) return true;
    
    // Không phải Admin hoặc Staff thì không có quyền gì
    if (!user || !user.id_permission) return false;
    
    const permissions = user.id_permission.permissions;
    if (!permissions || !permissions[resource]) return false;
    
    return permissions[resource][action] === true;
};

/**
 * Kiểm tra quyền View
 */
export const canView = (user, resource) => hasPermission(user, resource, 'view');

/**
 * Kiểm tra quyền Create
 */
export const canCreate = (user, resource) => hasPermission(user, resource, 'create');

/**
 * Kiểm tra quyền Edit
 */
export const canEdit = (user, resource) => hasPermission(user, resource, 'edit');

/**
 * Kiểm tra quyền Delete
 */
export const canDelete = (user, resource) => hasPermission(user, resource, 'delete');

/**
 * Lấy label permission cho UI
 */
export const getPermissionLabel = (user) => {
    if (isAdmin(user)) return "Admin";
    if (isStaff(user)) return "Nhân Viên";
    return "Customer";
};

/**
 * Kiểm tra xem có nên hiển thị component hay không
 * @param {Object} user
 * @param {string} resource
 * @param {string} minAction - Hành động tối thiểu cần có (view, create, edit, delete)
 * @returns {boolean}
 */
export const shouldShowComponent = (user, resource, minAction = 'view') => {
    // Admin luôn thấy tất cả
    if (isAdmin(user)) return true;
    
    // Check permission cụ thể
    return hasPermission(user, resource, minAction);
};
