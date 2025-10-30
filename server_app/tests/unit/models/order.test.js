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

  describe('Order Creation', () => {
    test('should create a valid order', async () => {
      const validOrder = {
        idUser: testUser._id,
        fullname: 'Test User',
        phone: '0123456789',
        address: '123 Test Street',
        total: 500000,
        status: 'pending'
      };

      const order = new Order(validOrder);
      const savedOrder = await order.save();

      expect(savedOrder._id).toBeDefined();
      expect(savedOrder.idUser.toString()).toBe(testUser._id.toString());
      expect(savedOrder.total).toBe(validOrder.total);
      expect(savedOrder.status).toBe('pending');
    });

    test('should fail to create order without required fields', async () => {
      const invalidOrder = new Order({
        fullname: 'Test User'
      });
      
      let error;
      try {
        await invalidOrder.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
    });

    test('should set default status to pending', async () => {
      const order = await Order.create({
        idUser: testUser._id,
        fullname: 'Test User',
        phone: '0123456789',
        address: '123 Test Street',
        total: 500000
      });

      expect(order.status).toBe('pending');
    });

    test('should validate total is a positive number', async () => {
      const invalidOrder = {
        idUser: testUser._id,
        fullname: 'Test User',
        phone: '0123456789',
        address: '123 Test Street',
        total: -100
      };

      const order = new Order(invalidOrder);
      
      let error;
      try {
        await order.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
    });
  });

  describe('Order Status Updates', () => {
    test('should update order status to confirmed', async () => {
      const order = await Order.create({
        idUser: testUser._id,
        fullname: 'Test User',
        phone: '0123456789',
        address: '123 Test Street',
        total: 500000,
        status: 'pending'
      });

      order.status = 'confirmed';
      const updatedOrder = await order.save();

      expect(updatedOrder.status).toBe('confirmed');
    });

    test('should update order status to delivered', async () => {
      const order = await Order.create({
        idUser: testUser._id,
        fullname: 'Test User',
        phone: '0123456789',
        address: '123 Test Street',
        total: 500000,
        status: 'confirmed'
      });

      order.status = 'delivered';
      const updatedOrder = await order.save();

      expect(updatedOrder.status).toBe('delivered');
    });

    test('should update order status to cancelled', async () => {
      const order = await Order.create({
        idUser: testUser._id,
        fullname: 'Test User',
        phone: '0123456789',
        address: '123 Test Street',
        total: 500000,
        status: 'pending'
      });

      order.status = 'cancelled';
      const updatedOrder = await order.save();

      expect(updatedOrder.status).toBe('cancelled');
    });
  });

  describe('Order Queries', () => {
    beforeEach(async () => {
      await Order.create([
        {
          idUser: testUser._id,
          fullname: 'Test User',
          phone: '0123456789',
          address: '123 Test Street',
          total: 300000,
          status: 'pending'
        },
        {
          idUser: testUser._id,
          fullname: 'Test User',
          phone: '0123456789',
          address: '123 Test Street',
          total: 500000,
          status: 'confirmed'
        },
        {
          idUser: testUser._id,
          fullname: 'Test User',
          phone: '0123456789',
          address: '123 Test Street',
          total: 700000,
          status: 'delivered'
        }
      ]);
    });

    test('should find orders by user', async () => {
      const orders = await Order.find({ idUser: testUser._id });
      expect(orders).toHaveLength(3);
    });

    test('should find orders by status', async () => {
      const pendingOrders = await Order.find({ status: 'pending' });
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
