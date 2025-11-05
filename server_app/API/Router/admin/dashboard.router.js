const express = require('express');
const router = express.Router();

const Products = require('../../../Models/product');
const Order = require('../../../Models/order');
const Users = require('../../../Models/user');
const Categories = require('../../../Models/category');

// Thống kê tổng quan
router.get('/statistics', async (req, res) => {
    try {
        const totalProducts = await Products.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await Users.countDocuments();
        
        // Tính doanh thu tháng hiện tại
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        
        const allOrders = await Order.find({});
        let monthlyRevenue = 0;
        let monthlyOrders = 0;
        
        allOrders.forEach(order => {
            if (order.create_time && order.total) {
                let orderDate;
                if (typeof order.create_time === 'string' && order.create_time.includes('_')) {
                    const dateStr = order.create_time.split('_')[0];
                    orderDate = new Date(dateStr);
                } else {
                    orderDate = new Date(order.create_time);
                }
                
                if (orderDate.getFullYear() === currentYear && orderDate.getMonth() + 1 === currentMonth) {
                    monthlyRevenue += order.total;
                    monthlyOrders += 1;
                }
            }
        });

        // Khách hàng mới trong tháng
        const recentUsers = await Users.find({});
        const newCustomers = recentUsers.length;

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            monthlyRevenue,
            monthlyOrders,
            newCustomers
        });
    } catch (error) {
        console.error('Error in statistics:', error);
        res.status(500).json({ error: error.message });
    }
});

// Thống kê theo danh mục
router.get('/category-stats', async (req, res) => {
    try {
        const categories = await Categories.find({});
        const products = await Products.find({});
        
        const categoryStats = {};
        
        // Khởi tạo stats cho tất cả categories
        categories.forEach(cat => {
            categoryStats[cat.category] = 0;
        });
        
        // Đếm products theo category
        products.forEach(product => {
            const category = categories.find(cat => cat._id.toString() === product.id_category);
            if (category) {
                categoryStats[category.category] += 1;
            } else {
                categoryStats['Chưa phân loại'] = (categoryStats['Chưa phân loại'] || 0) + 1;
            }
        });

        // Chuyển đổi thành array
        const result = Object.keys(categoryStats).map(key => ({
            _id: key,
            count: categoryStats[key]
        }));

        res.json(result);
    } catch (error) {
        console.error('Error in category-stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Doanh số theo tháng
router.get('/sales-by-month', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        
        const allOrders = await Order.find({});
        
        // Tạo array 12 tháng với giá trị mặc định
        const monthlyData = Array.from({length: 12}, (_, i) => ({
            month: i + 1,
            totalSales: 0,
            orderCount: 0
        }));

        // Xử lý từng order
        allOrders.forEach(order => {
            if (order.create_time && order.total) {
                let orderDate;
                
                // Xử lý format YYYY-MM-DD_index
                if (typeof order.create_time === 'string' && order.create_time.includes('_')) {
                    const dateStr = order.create_time.split('_')[0];
                    orderDate = new Date(dateStr);
                } else {
                    orderDate = new Date(order.create_time);
                }
                
                if (orderDate.getFullYear() === currentYear) {
                    const month = orderDate.getMonth(); // 0-based
                    if (month >= 0 && month < 12) {
                        monthlyData[month].totalSales += order.total;
                        monthlyData[month].orderCount += 1;
                    }
                }
            }
        });

        res.json(monthlyData);
    } catch (error) {
        console.error('Error in sales-by-month:', error);
        res.status(500).json({ error: error.message });
    }
});

// Doanh thu theo tháng
router.get('/revenue-by-month', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        
        const allOrders = await Order.find({});
        
        // Tạo array 12 tháng với giá trị mặc định
        const monthlyRevenue = Array.from({length: 12}, (_, i) => ({
            month: i + 1,
            revenue: 0
        }));

        // Xử lý từng order
        allOrders.forEach(order => {
            if (order.create_time && order.total) {
                let orderDate;
                
                // Xử lý format YYYY-MM-DD_index
                if (typeof order.create_time === 'string' && order.create_time.includes('_')) {
                    const dateStr = order.create_time.split('_')[0];
                    orderDate = new Date(dateStr);
                } else {
                    orderDate = new Date(order.create_time);
                }
                
                if (orderDate.getFullYear() === currentYear) {
                    const month = orderDate.getMonth(); // 0-based
                    if (month >= 0 && month < 12) {
                        monthlyRevenue[month].revenue += order.total;
                    }
                }
            }
        });

        res.json(monthlyRevenue);
    } catch (error) {
        console.error('Error in revenue-by-month:', error);
        res.status(500).json({ error: error.message });
    }
});

// Trạng thái đơn hàng
router.get('/order-status', async (req, res) => {
    try {
        const allOrders = await Order.find({});
        
        // Group theo status bằng JavaScript
        const statusCount = {};
        
        allOrders.forEach(order => {
            const status = order.status || 'Không xác định';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });

        // Chuyển đổi thành array
        const result = Object.keys(statusCount).map(key => ({
            _id: key,
            count: statusCount[key]
        }));

        res.json(result);
    } catch (error) {
        console.error('Error in order-status:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;