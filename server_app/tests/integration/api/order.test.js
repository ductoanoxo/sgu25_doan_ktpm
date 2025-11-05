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

  afterAll(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    await DetailOrder.deleteMany({});
    await Category.deleteMany({});
  });

  beforeEach(async () => {
    await Order.deleteMany({});
    await DetailOrder.deleteMany({});
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
      expect(orders.length).toBeGreaterThanOrEqual(2);
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
  });
});
