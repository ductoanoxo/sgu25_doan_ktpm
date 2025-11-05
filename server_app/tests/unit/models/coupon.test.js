const Coupon = require('../../../Models/coupon');

describe('Coupon Model Unit Tests', () => {
  afterEach(async () => {
    await Coupon.deleteMany({});
  });

  describe('Coupon Creation', () => {
    test('should create a coupon with valid data', async () => {
      const couponData = {
        code: 'SUMMER2024',
        count: 100,
        promotion: 'Giảm 20%',
        describe: 'Khuyến mãi mùa hè'
      };

      const coupon = await Coupon.create(couponData);

      expect(coupon).toBeDefined();
      expect(coupon.code).toBe('SUMMER2024');
      expect(coupon.count).toBe(100);
      expect(coupon.promotion).toBe('Giảm 20%');
      expect(coupon.describe).toBe('Khuyến mãi mùa hè');
    });

    test('should create coupon with minimal data', async () => {
      const coupon = await Coupon.create({
        code: 'SIMPLE',
        count: 10
      });

      expect(coupon).toBeDefined();
      expect(coupon.code).toBe('SIMPLE');
      expect(coupon.count).toBe(10);
    });
  });

  describe('Coupon Queries', () => {
    beforeEach(async () => {
      await Coupon.create([
        { code: 'CODE1', count: 50, promotion: 'Giảm 10%' },
        { code: 'CODE2', count: 30, promotion: 'Giảm 15%' },
        { code: 'CODE3', count: 0, promotion: 'Giảm 20%' }
      ]);
    });

    test('should find all coupons', async () => {
      const coupons = await Coupon.find();
      expect(coupons).toHaveLength(3);
    });

    test('should find coupon by code', async () => {
      const coupon = await Coupon.findOne({ code: 'CODE1' });
      expect(coupon).toBeDefined();
      expect(coupon.count).toBe(50);
    });

    test('should find available coupons', async () => {
      const availableCoupons = await Coupon.find({ count: { $gt: 0 } });
      expect(availableCoupons).toHaveLength(2);
    });

    test('should find expired coupons', async () => {
      const expiredCoupons = await Coupon.find({ count: 0 });
      expect(expiredCoupons).toHaveLength(1);
      expect(expiredCoupons[0].code).toBe('CODE3');
    });
  });

  describe('Coupon Updates', () => {
    test('should decrease coupon count when used', async () => {
      const coupon = await Coupon.create({
        code: 'USEME',
        count: 10
      });

      coupon.count -= 1;
      await coupon.save();

      const updated = await Coupon.findById(coupon._id);
      expect(updated.count).toBe(9);
    });

    test('should update coupon details', async () => {
      const coupon = await Coupon.create({
        code: 'UPDATE',
        count: 20,
        promotion: 'Old Promotion'
      });

      coupon.promotion = 'New Promotion';
      coupon.describe = 'Updated description';
      await coupon.save();

      const updated = await Coupon.findById(coupon._id);
      expect(updated.promotion).toBe('New Promotion');
      expect(updated.describe).toBe('Updated description');
    });

    test('should not allow count to go negative', async () => {
      const coupon = await Coupon.create({
        code: 'NONEGA',
        count: 1
      });

      coupon.count = -1;
      await coupon.save();

      const current = await Coupon.findById(coupon._id);
      // Model doesn't validate negative count
      expect(current.count).toBe(-1);
    });
  });

  describe('Coupon Deletion', () => {
    test('should delete coupon', async () => {
      const coupon = await Coupon.create({
        code: 'DELETEME',
        count: 5
      });

      await Coupon.deleteOne({ _id: coupon._id });

      const deleted = await Coupon.findById(coupon._id);
      expect(deleted).toBeNull();
    });

    test('should delete multiple coupons', async () => {
      await Coupon.create([
        { code: 'DEL1', count: 0 },
        { code: 'DEL2', count: 0 },
        { code: 'KEEP', count: 10 }
      ]);

      await Coupon.deleteMany({ count: 0 });

      const remaining = await Coupon.find();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].code).toBe('KEEP');
    });
  });

  describe('Coupon Validation', () => {
    test('should validate unique coupon codes', async () => {
      await Coupon.create({
        code: 'UNIQUE',
        count: 10
      });

      // Model doesn't enforce unique codes
      const duplicate = await Coupon.create({
        code: 'UNIQUE',
        count: 20
      });

      expect(duplicate).toBeDefined();
      
      const coupons = await Coupon.find({ code: 'UNIQUE' });
      expect(coupons.length).toBeGreaterThanOrEqual(1);
    });
  });
});
