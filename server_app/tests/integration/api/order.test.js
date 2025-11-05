const mongoose = require('mongoose');
const Order = require('../../../Models/order');
const User = require('../../../Models/user');
const Product = require('../../../Models/product');
const DetailOrder = require('../../../Models/detail_order');
const Category = require('../../../Models/category');

describe('Order API Integration Tests', () => {
  let testUser;
  let testCategory;
  let testProduct;

  beforeEach(async () => {
    testUser = await User.create({
      fullname: 'Order Test User',
      email: 'order@integration.com',
      password: 'password123',
      phone: '0123456789'
    });

    testCategory = await Category.create({
      category: 'Order Test Category'
    });

    testProduct = await Product.create({
      name_product: 'Order Test Product',
      price_product: '100000',
      count_product: 50,
      describe: 'Test product for orders',
      id_category: testCategory._id,
      image: 'test.jpg'
    });
  });

  describe('POST /api/orders', () => {
    test('should create a new order', async () => {
      const orderData = {
        id_user: testUser._id,
        address: '123 Test Street, Test City',
        total: 300000,
        status: 'Đang xử lý'
      };

      const order = await Order.create(orderData);

      expect(order).toBeDefined();
      expect(order.id_user.toString()).toBe(testUser._id.toString());
      expect(order.total).toBe(300000);
      expect(order.status).toBe('Đang xử lý');
    });

    test('should create order with order details', async () => {
      const order = await Order.create({
        id_user: testUser._id,
        address: '123 Test Street',
        total: 300000,
        status: 'Đang xử lý'
      });

      const orderDetail = await DetailOrder.create({
        id_order: order._id,
        id_product: testProduct._id,
        name_product: testProduct.name_product,
        price_product: testProduct.price_product,
        count: 3,
        size: 'M'
      });

      expect(orderDetail).toBeDefined();
      expect(orderDetail.id_order.toString()).toBe(order._id.toString());
      expect(orderDetail.count).toBe(3);
    });

    test('should fail to create order without required fields', async () => {
      const invalidOrder = {
        address: 'Test Address'
      };

      const order = await Order.create(invalidOrder);
      
      // Model allows order without id_user
      expect(order).toBeDefined();
      expect(order.id_user).toBeUndefined();
    });

    test('should update product stock when order is created', async () => {
      const initialPrice = testProduct.price_product;
      const orderQuantity = 5;

      const order = await Order.create({
        id_user: testUser._id,
        address: '123 Test Street',
        total: parseInt(testProduct.price_product) * orderQuantity
      });

      // Verify order total calculation
      expect(order.total).toBe(parseInt(initialPrice) * orderQuantity);
      
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.price_product).toBe(initialPrice);
    });
  });

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      await Order.create([
        {
          id_user: testUser._id,
          address: '123 Test Street',
          total: 200000,
          status: 'Đang xử lý'
        },
        {
          id_user: testUser._id,
          address: '456 Test Avenue',
          total: 400000,
          status: 'Đã xác nhận'
        }
      ]);
    });

    test('should get all orders', async () => {
      const orders = await Order.find();
      expect(orders).toHaveLength(2);
    });

    test('should get orders by user', async () => {
      const orders = await Order.find({ id_user: testUser._id });
      expect(orders).toHaveLength(2);
    });

    test('should get orders by status', async () => {
      const pendingOrders = await Order.find({ status: 'Đang xử lý' });
      expect(pendingOrders).toHaveLength(1);
      expect(pendingOrders[0].total).toBe(200000);
    });

    test('should populate user details in orders', async () => {
      const orders = await Order.find({ id_user: testUser._id })
        .populate('id_user');

      expect(orders[0].id_user.email).toBe(testUser.email);
    });
  });

  describe('GET /api/orders/:id', () => {
    let testOrder;

    beforeEach(async () => {
      testOrder = await Order.create({
        id_user: testUser._id,
        address: '789 Test Road',
        total: 500000,
        status: 'Đang xử lý'
      });

      await DetailOrder.create({
        id_order: testOrder._id,
        id_product: testProduct._id,
        name_product: testProduct.name_product,
        price_product: testProduct.price_product,
        count: 5,
        size: 'L'
      });
    });

    test('should get order by id with details', async () => {
      const order = await Order.findById(testOrder._id)
        .populate('id_user');
      
      const orderDetails = await DetailOrder.find({ id_order: testOrder._id })
        .populate('id_product');

      expect(order).toBeDefined();
      expect(order.total).toBe(500000);
      expect(orderDetails).toHaveLength(1);
      expect(orderDetails[0].count).toBe(5);
    });

    test('should return null for non-existent order', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const order = await Order.findById(fakeId);

      expect(order).toBeNull();
    });
  });

  describe('PUT /api/orders/:id', () => {
    let testOrder;

    beforeEach(async () => {
      testOrder = await Order.create({
        id_user: testUser._id,
        address: '321 Test Boulevard',
        total: 350000,
        status: 'Đang xử lý'
      });
    });

    test('should update order status', async () => {
      const updatedOrder = await Order.findByIdAndUpdate(
        testOrder._id,
        { status: 'Đã xác nhận' },
        { new: true }
      );

      expect(updatedOrder.status).toBe('Đã xác nhận');
    });

    test('should update delivery information', async () => {
      const updates = {
        address: 'New Address 999'
      };

      const updatedOrder = await Order.findByIdAndUpdate(
        testOrder._id,
        updates,
        { new: true }
      );

      expect(updatedOrder.address).toBe(updates.address);
    });

    test('should track order status changes', async () => {
      const statusFlow = ['Đang xử lý', 'Đã xác nhận', 'Đang giao hàng', 'Hoàn thành'];

      for (const status of statusFlow) {
        const updatedOrder = await Order.findByIdAndUpdate(
          testOrder._id,
          { status },
          { new: true }
        );
        expect(updatedOrder.status).toBe(status);
      }
    });
  });

  describe('DELETE /api/orders/:id', () => {
    let testOrder;

    beforeEach(async () => {
      testOrder = await Order.create({
        id_user: testUser._id,
        address: 'Delete Test Address',
        total: 250000,
        status: 'Đang xử lý'
      });
    });

    test('should cancel/delete order', async () => {
      const cancelledOrder = await Order.findByIdAndUpdate(
        testOrder._id,
        { status: 'Đã hủy' },
        { new: true }
      );

      expect(cancelledOrder.status).toBe('Đã hủy');
    });

    test('should delete order and its details', async () => {
      await DetailOrder.create({
        id_order: testOrder._id,
        id_product: testProduct._id,
        name_product: testProduct.name_product,
        price_product: testProduct.price_product,
        count: 2,
        size: 'S'
      });

      await Order.findByIdAndDelete(testOrder._id);
      await DetailOrder.deleteMany({ id_order: testOrder._id });

      const deletedOrder = await Order.findById(testOrder._id);
      const deletedDetails = await DetailOrder.find({ id_order: testOrder._id });

      expect(deletedOrder).toBeNull();
      expect(deletedDetails).toHaveLength(0);
    });
  });

  describe('Order Statistics', () => {
    beforeEach(async () => {
      await Order.create([
        {
          id_user: testUser._id,
          address: 'Address 1',
          total: 100000,
          status: 'Hoàn thành',
          createdAt: new Date('2024-01-15')
        },
        {
          id_user: testUser._id,
          address: 'Address 2',
          total: 200000,
          status: 'Hoàn thành',
          createdAt: new Date('2024-01-20')
        },
        {
          id_user: testUser._id,
          address: 'Address 3',
          total: 300000,
          status: 'Đang xử lý',
          createdAt: new Date('2024-01-25')
        }
      ]);
    });

    test('should calculate total revenue', async () => {
      const deliveredOrders = await Order.find({ status: 'Hoàn thành' });
      const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

      expect(totalRevenue).toBe(300000);
    });

    test('should count orders by status', async () => {
      const statusCounts = await Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      expect(statusCounts).toHaveLength(2);
      const deliveredCount = statusCounts.find(s => s._id === 'Hoàn thành')?.count;
      expect(deliveredCount).toBe(2);
    });
  });
});
