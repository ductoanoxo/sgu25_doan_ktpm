const Order = require('../../../Models/order');
const Users = require('../../../Models/user');
const Payment = require('../../../Models/payment');
const Note = require('../../../Models/note');
const Coupon = require('../../../Models/coupon');

describe('Order Model Unit Tests', () => {
  let testUser;
  let testPayment;
  let testNote;
  let testCoupon;

  beforeAll(async () => {
    // Tạo dữ liệu liên quan
    testUser = await Users.create({
      username: 'orderuser',
      password: 'password123',
      fullname: 'Order User',
      email: 'order@example.com'
    });

    testPayment = await Payment.create({
      pay_name: 'Thanh toán khi nhận hàng'
    });

    testNote = await Note.create({
      fullname: 'Người Nhận',
      phone: '0909123456'
    });

    testCoupon = await Coupon.create({
      code: 'DISCOUNT10',
      count: 10,
      promotion: 'Giảm 10%',
      describe: 'Giảm giá 10%'
    });
  });

  afterEach(async () => {
    await Order.deleteMany({});
  });

  describe('Order Creation', () => {
    test('should create an order with valid data', async () => {
      const orderData = {
        id_user: testUser._id,
        id_payment: testPayment._id,
        id_note: testNote._id,
        address: '123 Nguyễn Trãi, Q.1, TP.HCM',
        total: 500000,
        status: 'Đang xử lý',
        pay: false,
        feeship: 30000,
        id_coupon: testCoupon._id,
        create_time: new Date().toISOString()
      };

      const order = await Order.create(orderData);

      expect(order).toBeDefined();
      expect(order.id_user.toString()).toBe(testUser._id.toString());
      expect(order.address).toBe('123 Nguyễn Trãi, Q.1, TP.HCM');
      expect(order.total).toBe(500000);
      expect(order.status).toBe('Đang xử lý');
      expect(order.pay).toBe(false);
      expect(order.feeship).toBe(30000);
    });

    test('should create order without coupon', async () => {
      const orderData = {
        id_user: testUser._id,
        id_payment: testPayment._id,
        id_note: testNote._id,
        address: '456 Lê Lợi, Q.3, TP.HCM',
        total: 300000,
        status: 'Đang xử lý',
        pay: false,
        feeship: 25000,
        create_time: new Date().toISOString()
      };

      const order = await Order.create(orderData);

      expect(order).toBeDefined();
      expect(order.total).toBe(300000);
      expect(order.id_coupon).toBeUndefined();
    });

    test('should set create_time when provided', async () => {
      const testTime = new Date().toISOString();
      const orderData = {
        id_user: testUser._id,
        id_payment: testPayment._id,
        address: '789 Hai Bà Trưng, Q.1, TP.HCM',
        total: 400000,
        status: 'Đang xử lý',
        create_time: testTime
      };

      const order = await Order.create(orderData);

      expect(order.create_time).toBe(testTime);
    });
  });

  describe('Order Status Updates', () => {
    test('should update order status', async () => {
      const order = await Order.create({
        id_user: testUser._id,
        id_payment: testPayment._id,
        address: 'Test Address',
        total: 200000,
        status: 'Đang xử lý'
      });

      order.status = 'Đang giao hàng';
      await order.save();

      const updated = await Order.findById(order._id);
      expect(updated.status).toBe('Đang giao hàng');
    });

    test('should update payment status', async () => {
      const order = await Order.create({
        id_user: testUser._id,
        id_payment: testPayment._id,
        address: 'Test Address',
        total: 200000,
        status: 'Đang xử lý',
        pay: false
      });

      order.pay = true;
      await order.save();

      const updated = await Order.findById(order._id);
      expect(updated.pay).toBe(true);
    });
  });

  describe('Order Queries', () => {
    beforeEach(async () => {
      await Order.create([
        {
          id_user: testUser._id,
          id_payment: testPayment._id,
          address: 'Address 1',
          total: 100000,
          status: 'Đang xử lý',
          pay: false
        },
        {
          id_user: testUser._id,
          id_payment: testPayment._id,
          address: 'Address 2',
          total: 200000,
          status: 'Hoàn thành',
          pay: true
        },
        {
          id_user: testUser._id,
          id_payment: testPayment._id,
          address: 'Address 3',
          total: 300000,
          status: 'Đang giao hàng',
          pay: false
        }
      ]);
    });

    test('should find orders by user', async () => {
      const orders = await Order.find({ id_user: testUser._id });
      expect(orders).toHaveLength(3);
    });

    test('should find orders by status', async () => {
      const orders = await Order.find({ status: 'Đang xử lý' });
      expect(orders).toHaveLength(1);
      expect(orders[0].total).toBe(100000);
    });

    test('should find paid orders', async () => {
      const orders = await Order.find({ pay: true });
      expect(orders).toHaveLength(1);
      expect(orders[0].status).toBe('Hoàn thành');
    });

    test('should find unpaid orders', async () => {
      const orders = await Order.find({ pay: false });
      expect(orders).toHaveLength(2);
    });

    test('should find orders by total range', async () => {
      const orders = await Order.find({
        total: { $gte: 150000, $lte: 250000 }
      });
      expect(orders).toHaveLength(1);
      expect(orders[0].total).toBe(200000);
    });
  });

  describe('Order Deletion', () => {
    test('should delete order', async () => {
      const order = await Order.create({
        id_user: testUser._id,
        id_payment: testPayment._id,
        address: 'Delete Address',
        total: 100000,
        status: 'Hủy'
      });

      await Order.deleteOne({ _id: order._id });
      
      const deleted = await Order.findById(order._id);
      expect(deleted).toBeNull();
    });
  });
});
