const Product = require('../../../Models/product');
const Category = require('../../../Models/category');

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
          name_product: 'Product 1',
          price_product: 100000,
          count_product: 10,
          describe: 'Description 1',
          category: testCategory._id,
          img1: 'img1.jpg'
        },
        {
          name_product: 'Product 2',
          price_product: 200000,
          count_product: 5,
          describe: 'Description 2',
          category: testCategory._id,
          img1: 'img2.jpg'
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
      const products = await Product.find({ category: testCategory._id });
      expect(products).toHaveLength(2);
    });

    test('should filter products by price range', async () => {
      const minPrice = 150000;
      const maxPrice = 250000;
      const products = await Product.find({
        price_product: { $gte: minPrice, $lte: maxPrice }
      });

      expect(products).toHaveLength(1);
      expect(products[0].name_product).toBe('Product 2');
    });
  });

  describe('GET /api/products/:id', () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        name_product: 'Single Product',
        price_product: 150000,
        count_product: 15,
        describe: 'Single product description',
        category: testCategory._id,
        img1: 'single.jpg'
      });
    });

    test('should get product by id', async () => {
      const product = await Product.findById(testProduct._id)
        .populate('category');

      expect(product).toBeDefined();
      expect(product.name_product).toBe('Single Product');
      expect(product.category.category).toBe('Integration Test Category');
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
        name_product: 'New Product',
        price_product: 300000,
        count_product: 20,
        describe: 'New product description',
        category: testCategory._id,
        img1: 'new.jpg',
        img2: 'new2.jpg',
        img3: 'new3.jpg',
        img4: 'new4.jpg'
      };

      const product = await Product.create(newProduct);

      expect(product).toBeDefined();
      expect(product.name_product).toBe(newProduct.name_product);
      expect(product.price_product).toBe(newProduct.price_product);
    });

    test('should fail to create product without required fields', async () => {
      const invalidProduct = {
        name_product: 'Incomplete Product'
      };

      let error;
      try {
        await Product.create(invalidProduct);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });
  });

  describe('PUT /api/products/:id', () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        name_product: 'Update Product',
        price_product: 100000,
        count_product: 10,
        describe: 'Update description',
        category: testCategory._id,
        img1: 'update.jpg'
      });
    });

    test('should update product', async () => {
      const updates = {
        name_product: 'Updated Product Name',
        price_product: 150000,
        count_product: 15
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        testProduct._id,
        updates,
        { new: true, runValidators: true }
      );

      expect(updatedProduct.name_product).toBe(updates.name_product);
      expect(updatedProduct.price_product).toBe(updates.price_product);
      expect(updatedProduct.count_product).toBe(updates.count_product);
    });

    test('should fail to update with invalid data', async () => {
      const invalidUpdates = {
        price_product: -100
      };

      let error;
      try {
        await Product.findByIdAndUpdate(
          testProduct._id,
          invalidUpdates,
          { new: true, runValidators: true }
        );
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });
  });

  describe('DELETE /api/products/:id', () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        name_product: 'Delete Product',
        price_product: 100000,
        count_product: 10,
        describe: 'Delete description',
        category: testCategory._id,
        img1: 'delete.jpg'
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
          name_product: 'Red Shirt',
          price_product: 100000,
          count_product: 10,
          category: testCategory._id,
          img1: 'red.jpg'
        },
        {
          name_product: 'Blue Shirt',
          price_product: 120000,
          count_product: 8,
          category: testCategory._id,
          img1: 'blue.jpg'
        },
        {
          name_product: 'Red Pants',
          price_product: 150000,
          count_product: 5,
          category: testCategory._id,
          img1: 'pants.jpg'
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
