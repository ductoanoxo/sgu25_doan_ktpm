const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Products = require('../../../Models/product');
const Category = require('../../../Models/category');

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const productController = require('../../../API/Controller/product.controller');
const productRouter = express.Router();

productRouter.get('/', productController.index);
productRouter.get('/category', productController.category);
productRouter.get('/pagination', productController.pagination);
productRouter.get('/scroll', productController.scoll);
productRouter.get('/:id', productController.detail);

app.use('/api/product', productRouter);

describe('Product API Integration Tests', () => {
  let testCategory;
  let testProducts; // Add this variable
  const testProductsData = [
    {
      name_product: 'Áo Thun Nam',
      price_product: '199000',
      image: 'aothunnam.jpg',
      describe: 'Áo thun cotton cao cấp',
      gender: 'Nam'
    },
    {
      name_product: 'Áo Sơ Mi Nữ',
      price_product: '299000',
      image: 'aosominu.jpg',
      describe: 'Áo sơ mi công sở',
      gender: 'Nữ'
    },
    {
      name_product: 'Áo Polo Unisex',
      price_product: '249000',
      image: 'aopolo.jpg',
      describe: 'Áo polo thể thao',
      gender: 'Unisex'
    }
  ];

  beforeEach(async () => {
    testCategory = await Category.create({ category: 'Áo' });
  });

  beforeEach(async () => {
    // Xóa và tạo lại products trước mỗi test để đảm bảo sự cô lập
    await Products.deleteMany({});
    testProducts = await Products.create(testProductsData.map(p => ({ ...p, id_category: testCategory._id })));
  });

  afterAll(async () => {
    await Products.deleteMany({});
    await Category.deleteMany({});
  });

  describe('GET /api/product', () => {
    test('should get all products', async () => {
      const response = await request(app)
        .get('/api/product')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(3);
    });

    test('should return empty array when no products', async () => {
      await Products.deleteMany({});

      const response = await request(app)
        .get('/api/product')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/product/:id', () => {
    test('should get product by id', async () => {
      const product = testProducts[0];

      const response = await request(app)
        .get(`/api/product/${product._id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.name_product).toBe('Áo Thun Nam');
      expect(response.body.price_product).toBe('199000');
      expect(response.body.gender).toBe('Nam');
    });

    test('should return null for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/product/${fakeId}`)
        .expect(200);

      expect(response.body).toBeNull();
    });
  });

  describe('GET /api/product/category', () => {
    test('should get all products when category is "all"', async () => {
      const response = await request(app)
        .get('/api/product/category')
        .query({ id_category: 'all' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(3);
    });

    test('should get products by category id', async () => {
      const response = await request(app)
        .get('/api/product/category')
        .query({ id_category: testCategory._id.toString() })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(3);
      expect(response.body[0].id_category.toString()).toBe(testCategory._id.toString());
    });

    test('should return empty array for non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get('/api/product/category')
        .query({ id_category: fakeId.toString() })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/product/pagination', () => {
    test('should paginate products correctly', async () => {
      const response = await request(app)
        .get('/api/product/pagination')
        .query({
          page: 1,
          count: 2,
          category: 'all'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
    });

    test('should return second page of products', async () => {
      const response = await request(app)
        .get('/api/product/pagination')
        .query({
          page: 2,
          count: 2,
          category: 'all'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
    });

    test('should search products by name', async () => {
      const response = await request(app)
        .get('/api/product/pagination')
        .query({
          page: 1,
          count: 10,
          category: 'all',
          search: 'Thun'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name_product).toContain('Thun');
    });

    test('should search products case-insensitively', async () => {
      const response = await request(app)
        .get('/api/product/pagination')
        .query({
          page: 1,
          count: 10,
          category: 'all',
          search: 'áo'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(3);
    });

    test('should filter by category and paginate', async () => {
      const response = await request(app)
        .get('/api/product/pagination')
        .query({
          page: 1,
          count: 2,
          category: testCategory._id.toString()
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
    });

    test('should return empty array when search has no results', async () => {
      const response = await request(app)
        .get('/api/product/pagination')
        .query({
          page: 1,
          count: 10,
          category: 'all',
          search: 'NonExistentProduct'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/product/scroll', () => {
    test('should return products for infinite scroll', async () => {
      const response = await request(app)
        .get('/api/product/scroll')
        .query({
          page: 1,
          count: 2,
          search: 'Áo'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
    });

    test('should return next page for scroll', async () => {
      const response = await request(app)
        .get('/api/product/scroll')
        .query({
          page: 2,
          count: 2,
          search: 'Áo'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
    });

    test('should filter scroll results by search term', async () => {
      const response = await request(app)
        .get('/api/product/scroll')
        .query({
          page: 1,
          count: 10,
          search: 'Polo'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name_product).toContain('Polo');
    });

    test('should return empty array for scroll with no matches', async () => {
      const response = await request(app)
        .get('/api/product/scroll')
        .query({
          page: 1,
          count: 10,
          search: 'xyz123'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });
  });
});
