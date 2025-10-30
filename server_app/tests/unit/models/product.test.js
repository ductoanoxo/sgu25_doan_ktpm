const Product = require('../../../Models/product');
const Category = require('../../../Models/category');

describe('Product Model Unit Tests', () => {
  let testCategory;

  beforeEach(async () => {
    testCategory = await Category.create({
      category: 'Test Category'
    });
  });

  describe('Product Creation', () => {
    test('should create a valid product', async () => {
      const validProduct = {
        name_product: 'Test Product',
        price_product: 100000,
        count_product: 10,
        describe: 'Test description',
        category: testCategory._id,
        img1: 'image1.jpg',
        img2: 'image2.jpg',
        img3: 'image3.jpg',
        img4: 'image4.jpg'
      };

      const product = new Product(validProduct);
      const savedProduct = await product.save();

      expect(savedProduct._id).toBeDefined();
      expect(savedProduct.name_product).toBe(validProduct.name_product);
      expect(savedProduct.price_product).toBe(validProduct.price_product);
      expect(savedProduct.count_product).toBe(validProduct.count_product);
    });

    test('should fail to create product without required fields', async () => {
      const invalidProduct = new Product({
        name_product: 'Test Product'
      });
      
      let error;
      try {
        await invalidProduct.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
    });

    test('should validate price is a positive number', async () => {
      const invalidPriceProduct = {
        name_product: 'Test Product',
        price_product: -100,
        count_product: 10,
        category: testCategory._id,
        img1: 'image1.jpg'
      };

      const product = new Product(invalidPriceProduct);
      
      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
    });

    test('should validate count is a non-negative number', async () => {
      const invalidCountProduct = {
        name_product: 'Test Product',
        price_product: 100000,
        count_product: -5,
        category: testCategory._id,
        img1: 'image1.jpg'
      };

      const product = new Product(invalidCountProduct);
      
      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
    });
  });

  describe('Product Updates', () => {
    test('should update product stock count', async () => {
      const product = await Product.create({
        name_product: 'Stock Test Product',
        price_product: 100000,
        count_product: 10,
        category: testCategory._id,
        img1: 'image1.jpg'
      });

      product.count_product = 5;
      const updatedProduct = await product.save();

      expect(updatedProduct.count_product).toBe(5);
    });

    test('should update product price', async () => {
      const product = await Product.create({
        name_product: 'Price Test Product',
        price_product: 100000,
        count_product: 10,
        category: testCategory._id,
        img1: 'image1.jpg'
      });

      product.price_product = 150000;
      const updatedProduct = await product.save();

      expect(updatedProduct.price_product).toBe(150000);
    });
  });

  describe('Product Queries', () => {
    beforeEach(async () => {
      await Product.create([
        {
          name_product: 'Product 1',
          price_product: 100000,
          count_product: 10,
          category: testCategory._id,
          img1: 'image1.jpg'
        },
        {
          name_product: 'Product 2',
          price_product: 200000,
          count_product: 5,
          category: testCategory._id,
          img1: 'image2.jpg'
        }
      ]);
    });

    test('should find products by category', async () => {
      const products = await Product.find({ category: testCategory._id });
      expect(products).toHaveLength(2);
    });

    test('should find products by price range', async () => {
      const products = await Product.find({
        price_product: { $gte: 150000 }
      });
      expect(products).toHaveLength(1);
      expect(products[0].name_product).toBe('Product 2');
    });

    test('should find products in stock', async () => {
      const products = await Product.find({
        count_product: { $gt: 0 }
      });
      expect(products).toHaveLength(2);
    });
  });
});
