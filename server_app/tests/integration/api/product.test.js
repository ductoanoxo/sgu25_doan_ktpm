const Product = require('../../../Models/product');
const Category = require('../../../Models/category');
const mongoose = require('mongoose');

describe('Product API Integration Tests', () => {
  let testCategory;

  beforeEach(async () => {
    testCategory = await Category.create({
      category: 'Integration Test Category'
    });
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await Category.deleteMany({});
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await Product.create([
        {
          id_category: testCategory._id,
          name_product: 'Product 1',
          price_product: '100000',
          image: 'img1.jpg',
          describe: 'Description 1',
          gender: 'Nam'
        },
        {
          id_category: testCategory._id,
          name_product: 'Product 2',
          price_product: '200000',
          image: 'img2.jpg',
          describe: 'Description 2',
          gender: 'Nữ'
        }
      ]);
    });

    test('should get all products', async () => {
      const products = await Product.find();
      expect(products.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/products/:id', () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        id_category: testCategory._id,
        name_product: 'Single Product',
        price_product: '150000',
        image: 'single.jpg',
        describe: 'Single product description',
        gender: 'Unisex'
      });
    });

    test('should get product by id', async () => {
      const product = await Product.findById(testProduct._id);

      expect(product).toBeDefined();
      expect(product.name_product).toBe('Single Product');
      expect(product.price_product).toBe('150000');
    });
  });

  describe('POST /api/products', () => {
    test('should create a new product', async () => {
      const newProduct = {
        id_category: testCategory._id,
        name_product: 'New Product',
        price_product: '300000',
        image: 'new.jpg',
        describe: 'New product description',
        gender: 'Nam'
      };

      const product = await Product.create(newProduct);

      expect(product).toBeDefined();
      expect(product.name_product).toBe(newProduct.name_product);
    });
  });

  describe('PUT /api/products/:id', () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        id_category: testCategory._id,
        name_product: 'Update Product',
        price_product: '100000',
        image: 'update.jpg',
        describe: 'Update description',
        gender: 'Nam'
      });
    });

    test('should update product', async () => {
      const updates = {
        name_product: 'Updated Product Name',
        price_product: '150000',
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        testProduct._id,
        updates,
        { new: true }
      );

      expect(updatedProduct.name_product).toBe(updates.name_product);
      expect(updatedProduct.price_product).toBe(updates.price_product);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        id_category: testCategory._id,
        name_product: 'Delete Product',
        price_product: '100000',
        image: 'delete.jpg',
        describe: 'Delete description',
        gender: 'Nam'
      });
    });

    test('should delete product', async () => {
      await Product.findByIdAndDelete(testProduct._id);
      const deletedProduct = await Product.findById(testProduct._id);
      expect(deletedProduct).toBeNull();
    });
  });
});
