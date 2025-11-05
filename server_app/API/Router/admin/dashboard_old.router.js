const express = require('express');
const router = express.Router();

const Products = require('../../Models/product');
const Order = require('../../Models/order');
const Users = require('../../Models/user');

// Thống kê tổng quan
router.get('/statistics', async (req, res) => {
    try {
        const totalProducts = await Products.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await Users.countDocuments();
        
        // Tính doanh thu tháng hiện tại
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        
        // Lấy tất cả orders và filter bằng JavaScript vì create_time là string
        const allOrders = await Order.find({});
        
        let monthlyRevenue = 0;
        let monthlyOrders = 0;
        
        allOrders.forEach(order => {
            if (order.create_time) {
                const orderDate = new Date(order.create_time);
                if (orderDate.getMonth() + 1 === currentMonth && orderDate.getFullYear() === currentYear) {
                    monthlyRevenue += order.total || 0;
                    monthlyOrders++;
                }
            }
        });

        // Đếm khách hàng mới (giả sử user mới là user được tạo gần đây)
        // Vì User model không có create_time, ta sẽ đếm user có id mới nhất
        const recentUsers = await Users.find({}).sort({_id: -1}).limit(50);
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
        const categoryStats = await Products.aggregate([
            {
                $lookup: {
                    from: 'category', // collection name trong MongoDB
                    localField: 'id_category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$category.category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Xử lý trường hợp không có category
        const processedStats = categoryStats.map(stat => ({
            _id: stat._id || 'Chưa phân loại',
            count: stat.count
        }));

        res.json(processedStats);
    } catch (error) {
        console.error('Error in category-stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Doanh số theo tháng
router.get('/sales-by-month', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        
        // Lấy tất cả orders và group theo tháng bằng JavaScript
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
        
        // Lấy tất cả orders và group theo tháng bằng JavaScript
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

        // Convert thành format phù hợp cho chart
        const orderStatus = Object.keys(statusCount).map(status => ({
            _id: status,
            count: statusCount[status]
        }));

        res.json(orderStatus);
    } catch (error) {
        console.error('Error in order-status:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;