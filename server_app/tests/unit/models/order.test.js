const Order = require('../../../Models/order');
const User = require('../../../Models/user');

describe('Order Model Unit Tests', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      fullname: 'Test User',
      email: 'order@example.com',
      password: 'password123',
      phone: '0123456789'
    });
  });

  afterAll(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
  });

  beforeEach(async () => {
    await Order.deleteMany({});
  });

  describe('Order Creation', () => {
    test('should create a valid order', async () => {
      const validOrder = {
        id_user: testUser._id,
        address: '123 Test Street',
        total: 500000,
        status: 'Đang xử lý'
      };

      const order = new Order(validOrder);
      const savedOrder = await order.save();

      expect(savedOrder._id).toBeDefined();
      expect(savedOrder.id_user.toString()).toBe(testUser._id.toString());
      expect(savedOrder.total).toBe(validOrder.total);
      expect(savedOrder.status).toBe('Đang xử lý');
    });

    test('should create order with minimal fields', async () => {
      const order = await Order.create({
        id_user: testUser._id,
        address: '456 Test Street',
        total: 300000
      });
      
      expect(order).toBeDefined();
      expect(order.id_user.toString()).toBe(testUser._id.toString());
      expect(order.total).toBe(300000);
    });

    test('should create order without status', async () => {
      const order = await Order.create({
        id_user: testUser._id,
        address: '123 Test Street',
        total: 500000
      });

      // Model doesn't set default status, so it's undefined
      expect(order).toBeDefined();
      expect(order.total).toBe(500000);
    });

    test('should allow different order totals', async () => {
      const order = await Order.create({
        id_user: testUser._id,
        address: '123 Test Street',
        total: 1000000
      });

      expect(order.total).toBe(1000000);
    });
  });

  describe('Order Status Updates', () => {
    test('should update order status to confirmed', async () => {
      const order = await Order.create({
        id_user: testUser._id,
        address: '123 Test Street',
        total: 500000,
        status: 'Đang xử lý'
      });

      order.status = 'Đã xác nhận';
      const updatedOrder = await order.save();

      expect(updatedOrder.status).toBe('Đã xác nhận');
    });

    test('should update order status to delivered', async () => {
      const order = await Order.create({
        id_user: testUser._id,
        address: '123 Test Street',
        total: 500000,
        status: 'Đã xác nhận'
      });

      order.status = 'Đang giao hàng';
      const updatedOrder = await order.save();

      expect(updatedOrder.status).toBe('Đang giao hàng');
    });

    test('should update order status to cancelled', async () => {
      const order = await Order.create({
        id_user: testUser._id,
        address: '123 Test Street',
        total: 500000,
        status: 'Đang xử lý'
      });

      order.status = 'Đã hủy';
      const updatedOrder = await order.save();

      expect(updatedOrder.status).toBe('Đã hủy');
    });
  });

  describe('Order Queries', () => {
    beforeEach(async () => {
      await Order.create([
        {
          id_user: testUser._id,
          address: '123 Test Street',
          total: 300000,
          status: 'Đang xử lý'
        },
        {
          id_user: testUser._id,
          address: '456 Test Street',
          total: 500000,
          status: 'Đã xác nhận'
        },
        {
          id_user: testUser._id,
          address: '789 Test Street',
          total: 700000,
          status: 'Hoàn thành'
        }
      ]);
    });

    test('should find orders by user', async () => {
      const orders = await Order.find({ id_user: testUser._id });
      expect(orders).toHaveLength(3);
    });

    test('should find orders by status', async () => {
      const pendingOrders = await Order.find({ status: 'Đang xử lý' });
      expect(pendingOrders).toHaveLength(1);
      expect(pendingOrders[0].total).toBe(300000);
    });

    test('should find orders by total range', async () => {
      const expensiveOrders = await Order.find({
        total: { $gte: 500000 }
      });
      expect(expensiveOrders).toHaveLength(2);
    });
  });
});
