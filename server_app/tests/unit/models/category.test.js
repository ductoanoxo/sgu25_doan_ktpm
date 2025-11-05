const mongoose = require('mongoose');
const Category = require('../../../Models/category');

describe('Category Model Unit Tests', () => {
  afterEach(async () => {
    await Category.deleteMany({});
  });

  describe('Category Creation', () => {
    test('should create a category', async () => {
      const category = await Category.create({ category: 'Áo' });

      expect(category).toBeDefined();
      expect(category.category).toBe('Áo');
    });

    test('should create multiple categories', async () => {
      await Category.create([
        { category: 'Áo' },
        { category: 'Quần' },
        { category: 'Giày' }
      ]);

      const categories = await Category.find();
      expect(categories).toHaveLength(3);
    });
  });

  describe('Category Query', () => {
    beforeEach(async () => {
      await Category.create([
        { category: 'Áo' },
        { category: 'Quần' },
        { category: 'Giày' }
      ]);
    });

    test('should find all categories', async () => {
      const categories = await Category.find();
      expect(categories).toHaveLength(3);
    });

    test('should find category by name', async () => {
      const category = await Category.findOne({ category: 'Quần' });
      expect(category).toBeDefined();
      expect(category.category).toBe('Quần');
    });
  });

  describe('Category Update', () => {
    test('should update category name', async () => {
      const category = await Category.create({ category: 'Old Name' });
      
      category.category = 'New Name';
      await category.save();

      const updated = await Category.findById(category._id);
      expect(updated.category).toBe('New Name');
    });
  });

  describe('Category Deletion', () => {
    test('should delete category', async () => {
      const category = await Category.create({ category: 'Delete Me' });
      
      await Category.deleteOne({ _id: category._id });
      
      const deleted = await Category.findById(category._id);
      expect(deleted).toBeNull();
    });
  });
});
