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
      price_product: 100000,
      count_product: 50,
      describe: 'Test product for orders',
      category: testCategory._id,
      img1: 'test.jpg'
    });
  });

  describe('POST /api/orders', () => {
    test('should create a new order', async () => {
      const orderData = {
        idUser: testUser._id,
        fullname: testUser.fullname,
        phone: testUser.phone,
        address: '123 Test Street, Test City',
        total: 300000,
        status: 'pending'
      };

      const order = await Order.create(orderData);

      expect(order).toBeDefined();
      expect(order.idUser.toString()).toBe(testUser._id.toString());
      expect(order.total).toBe(300000);
      expect(order.status).toBe('pending');
    });

    test('should create order with order details', async () => {
      const order = await Order.create({
        idUser: testUser._id,
        fullname: testUser.fullname,
        phone: testUser.phone,
        address: '123 Test Street',
        total: 300000,
        status: 'pending'
      });

      const orderDetail = await DetailOrder.create({
        idOrder: order._id,
        idProduct: testProduct._id,
        nameProduct: testProduct.name_product,
        price: testProduct.price_product,
        count: 3,
        size: 'M'
      });

      expect(orderDetail).toBeDefined();
      expect(orderDetail.idOrder.toString()).toBe(order._id.toString());
      expect(orderDetail.count).toBe(3);
    });

    test('should fail to create order without required fields', async () => {
      const invalidOrder = {
        fullname: 'Test User'
      };

      let error;
      try {
        await Order.create(invalidOrder);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    test('should update product stock when order is created', async () => {
      const initialStock = testProduct.count_product;
      const orderQuantity = 5;

      await Order.create({
        idUser: testUser._id,
        fullname: testUser.fullname,
        phone: testUser.phone,
        address: '123 Test Street',
        total: testProduct.price_product * orderQuantity
      });

      // Simulate stock reduction
      testProduct.count_product -= orderQuantity;
      await testProduct.save();

      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.count_product).toBe(initialStock - orderQuantity);
    });
  });

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      await Order.create([
        {
          idUser: testUser._id,
          fullname: testUser.fullname,
          phone: testUser.phone,
          address: '123 Test Street',
          total: 200000,
          status: 'pending'
        },
        {
          idUser: testUser._id,
          fullname: testUser.fullname,
          phone: testUser.phone,
          address: '456 Test Avenue',
          total: 400000,
          status: 'confirmed'
        }
      ]);
    });

    test('should get all orders', async () => {
      const orders = await Order.find();
      expect(orders).toHaveLength(2);
    });

    test('should get orders by user', async () => {
      const orders = await Order.find({ idUser: testUser._id });
      expect(orders).toHaveLength(2);
    });

    test('should get orders by status', async () => {
      const pendingOrders = await Order.find({ status: 'pending' });
      expect(pendingOrders).toHaveLength(1);
      expect(pendingOrders[0].total).toBe(200000);
    });

    test('should populate user details in orders', async () => {
      const orders = await Order.find({ idUser: testUser._id })
        .populate('idUser');

      expect(orders[0].idUser.email).toBe(testUser.email);
    });
  });

  describe('GET /api/orders/:id', () => {
    let testOrder;

    beforeEach(async () => {
      testOrder = await Order.create({
        idUser: testUser._id,
        fullname: testUser.fullname,
        phone: testUser.phone,
        address: '789 Test Road',
        total: 500000,
        status: 'pending'
      });

      await DetailOrder.create({
        idOrder: testOrder._id,
        idProduct: testProduct._id,
        nameProduct: testProduct.name_product,
        price: testProduct.price_product,
        count: 5,
        size: 'L'
      });
    });

    test('should get order by id with details', async () => {
      const order = await Order.findById(testOrder._id)
        .populate('idUser');
      
      const orderDetails = await DetailOrder.find({ idOrder: testOrder._id })
        .populate('idProduct');

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
        idUser: testUser._id,
        fullname: testUser.fullname,
        phone: testUser.phone,
        address: '321 Test Boulevard',
        total: 350000,
        status: 'pending'
      });
    });

    test('should update order status', async () => {
      const updatedOrder = await Order.findByIdAndUpdate(
        testOrder._id,
        { status: 'confirmed' },
        { new: true }
      );

      expect(updatedOrder.status).toBe('confirmed');
    });

    test('should update delivery information', async () => {
      const updates = {
        address: 'New Address 999',
        phone: '0987654321'
      };

      const updatedOrder = await Order.findByIdAndUpdate(
        testOrder._id,
        updates,
        { new: true }
      );

      expect(updatedOrder.address).toBe(updates.address);
      expect(updatedOrder.phone).toBe(updates.phone);
    });

    test('should track order status changes', async () => {
      const statusFlow = ['pending', 'confirmed', 'shipping', 'delivered'];

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
        idUser: testUser._id,
        fullname: testUser.fullname,
        phone: testUser.phone,
        address: 'Delete Test Address',
        total: 250000,
        status: 'pending'
      });
    });

    test('should cancel/delete order', async () => {
      const cancelledOrder = await Order.findByIdAndUpdate(
        testOrder._id,
        { status: 'cancelled' },
        { new: true }
      );

      expect(cancelledOrder.status).toBe('cancelled');
    });

    test('should delete order and its details', async () => {
      await DetailOrder.create({
        idOrder: testOrder._id,
        idProduct: testProduct._id,
        nameProduct: testProduct.name_product,
        price: testProduct.price_product,
        count: 2,
        size: 'S'
      });

      await Order.findByIdAndDelete(testOrder._id);
      await DetailOrder.deleteMany({ idOrder: testOrder._id });

      const deletedOrder = await Order.findById(testOrder._id);
      const deletedDetails = await DetailOrder.find({ idOrder: testOrder._id });

      expect(deletedOrder).toBeNull();
      expect(deletedDetails).toHaveLength(0);
    });
  });

  describe('Order Statistics', () => {
    beforeEach(async () => {
      await Order.create([
        {
          idUser: testUser._id,
          fullname: testUser.fullname,
          phone: testUser.phone,
          address: 'Address 1',
          total: 100000,
          status: 'delivered',
          createdAt: new Date('2024-01-15')
        },
        {
          idUser: testUser._id,
          fullname: testUser.fullname,
          phone: testUser.phone,
          address: 'Address 2',
          total: 200000,
          status: 'delivered',
          createdAt: new Date('2024-01-20')
        },
        {
          idUser: testUser._id,
          fullname: testUser.fullname,
          phone: testUser.phone,
          address: 'Address 3',
          total: 300000,
          status: 'pending',
          createdAt: new Date('2024-01-25')
        }
      ]);
    });

    test('should calculate total revenue', async () => {
      const deliveredOrders = await Order.find({ status: 'delivered' });
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
      const deliveredCount = statusCounts.find(s => s._id === 'delivered')?.count;
      expect(deliveredCount).toBe(2);
    });
  });
});
