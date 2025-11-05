const Payment = require('../../../Models/payment');

describe('Payment Model Unit Tests', () => {
  afterEach(async () => {
    await Payment.deleteMany({});
  });

  describe('Payment Creation', () => {
    test('should create a payment method', async () => {
      const payment = await Payment.create({
        pay_name: 'Thanh toán khi nhận hàng'
      });

      expect(payment).toBeDefined();
      expect(payment.pay_name).toBe('Thanh toán khi nhận hàng');
    });

    test('should create multiple payment methods', async () => {
      await Payment.create([
        { pay_name: 'Thanh toán khi nhận hàng' },
        { pay_name: 'Chuyển khoản ngân hàng' },
        { pay_name: 'Thẻ tín dụng' },
        { pay_name: 'Stripe Payment' },
        { pay_name: 'PayPal' }
      ]);

      const payments = await Payment.find();
      expect(payments).toHaveLength(5);
    });
  });

  describe('Payment Queries', () => {
    beforeEach(async () => {
      await Payment.create([
        { pay_name: 'COD' },
        { pay_name: 'Bank Transfer' },
        { pay_name: 'Credit Card' }
      ]);
    });

    test('should find all payment methods', async () => {
      const payments = await Payment.find();
      expect(payments).toHaveLength(3);
    });

    test('should find payment by name', async () => {
      const payment = await Payment.findOne({ pay_name: 'COD' });
      expect(payment).toBeDefined();
      expect(payment.pay_name).toBe('COD');
    });

    test('should find payment by id', async () => {
      const created = await Payment.create({ pay_name: 'Find By ID' });
      const payment = await Payment.findById(created._id);
      
      expect(payment).toBeDefined();
      expect(payment.pay_name).toBe('Find By ID');
    });
  });

  describe('Payment Updates', () => {
    test('should update payment name', async () => {
      const payment = await Payment.create({
        pay_name: 'Old Name'
      });

      payment.pay_name = 'New Name';
      await payment.save();

      const updated = await Payment.findById(payment._id);
      expect(updated.pay_name).toBe('New Name');
    });
  });

  describe('Payment Deletion', () => {
    test('should delete payment method', async () => {
      const payment = await Payment.create({
        pay_name: 'Delete Me'
      });

      await Payment.deleteOne({ _id: payment._id });

      const deleted = await Payment.findById(payment._id);
      expect(deleted).toBeNull();
    });
  });

  describe('Common Payment Methods', () => {
    test('should support COD', async () => {
      const cod = await Payment.create({
        pay_name: 'Thanh toán khi nhận hàng'
      });

      expect(cod.pay_name).toContain('nhận hàng');
    });

    test('should support Stripe', async () => {
      const stripe = await Payment.create({
        pay_name: 'Stripe Payment'
      });

      expect(stripe.pay_name).toContain('Stripe');
    });

    test('should support bank transfer', async () => {
      const bank = await Payment.create({
        pay_name: 'Chuyển khoản ngân hàng'
      });

      expect(bank.pay_name).toContain('ngân hàng');
    });
  });
});
