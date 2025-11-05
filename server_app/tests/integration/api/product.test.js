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
      expect(products).toHaveLength(2);
    });

    test('should get products with pagination', async () => {
      const page = 1;
      const limit = 1;
      const products = await Product.find()
        .limit(limit)
        .skip((page - 1) * limit);

      expect(products).toHaveLength(1);
    });

    test('should filter products by category', async () => {
      const products = await Product.find({ id_category: testCategory._id });
      expect(products).toHaveLength(2);
    });

    test('should filter products by gender', async () => {
      const products = await Product.find({ gender: 'Nam' });
      expect(products).toHaveLength(1);
      expect(products[0].name_product).toBe('Product 1');
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

    test('should return null for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const product = await Product.findById(fakeId);

      expect(product).toBeNull();
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
      expect(product.price_product).toBe(newProduct.price_product);
      expect(product.image).toBe(newProduct.image);
    });

    test('should fail to create product without required fields', async () => {
      const invalidProduct = {
        name_product: 'Incomplete Product'
        // Missing required 'image' field
      };

      await expect(Product.create(invalidProduct))
        .rejects.toThrow();
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
        describe: 'Updated description'
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        testProduct._id,
        updates,
        { new: true, runValidators: true }
      );

      expect(updatedProduct.name_product).toBe(updates.name_product);
      expect(updatedProduct.price_product).toBe(updates.price_product);
      expect(updatedProduct.describe).toBe(updates.describe);
    });

    test('should keep image when updating other fields', async () => {
      const updates = {
        name_product: 'Updated Name Only'
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        testProduct._id,
        updates,
        { new: true }
      );

      expect(updatedProduct.image).toBe('update.jpg');
      expect(updatedProduct.name_product).toBe('Updated Name Only');
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

    test('should return null when deleting non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const result = await Product.findByIdAndDelete(fakeId);

      expect(result).toBeNull();
    });
  });

  describe('Product Search', () => {
    beforeEach(async () => {
      await Product.create([
        {
          id_category: testCategory._id,
          name_product: 'Red Shirt',
          price_product: '100000',
          image: 'red.jpg',
          gender: 'Nam'
        },
        {
          id_category: testCategory._id,
          name_product: 'Blue Shirt',
          price_product: '120000',
          image: 'blue.jpg',
          gender: 'Nữ'
        },
        {
          id_category: testCategory._id,
          name_product: 'Red Pants',
          price_product: '150000',
          image: 'pants.jpg',
          gender: 'Nam'
        }
      ]);
    });

    test('should search products by name', async () => {
      const searchTerm = 'Red';
      const products = await Product.find({
        name_product: { $regex: searchTerm, $options: 'i' }
      });

      expect(products).toHaveLength(2);
      expect(products.every(p => p.name_product.includes('Red'))).toBe(true);
    });

    test('should search products by partial name', async () => {
      const searchTerm = 'Shirt';
      const products = await Product.find({
        name_product: { $regex: searchTerm, $options: 'i' }
      });

      expect(products).toHaveLength(2);
    });
  });
});
