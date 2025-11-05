const Comment = require('../../../Models/comment');
const Products = require('../../../Models/product');
const Users = require('../../../Models/user');
const Category = require('../../../Models/category');

describe('Comment Model Unit Tests', () => {
  let testProduct;
  let testUser;

  beforeEach(async () => {
    // Tạo category
    const category = await Category.create({ category: 'Áo' });
    
    // Tạo product
    testProduct = await Products.create({
      id_category: category._id,
      name_product: 'Test Product',
      price_product: '199000',
      image: 'test.jpg',
      describe: 'Test description'
    });

    // Tạo user
    testUser = await Users.create({
      username: 'commenter',
      password: 'password123',
      fullname: 'Commenter User',
      email: 'commenter@example.com'
    });
  });

  afterAll(async () => {
    await Comment.deleteMany({});
    await Products.deleteMany({});
    await Users.deleteMany({});
    await Category.deleteMany({});
  });

  beforeEach(async () => {
    await Comment.deleteMany({});
  });

  describe('Comment Creation', () => {
    test('should create a comment with valid data', async () => {
      const commentData = {
        id_product: testProduct._id,
        id_user: testUser._id,
        content: 'Sản phẩm rất tốt!',
        star: 5
      };

      const comment = await Comment.create(commentData);

      expect(comment).toBeDefined();
      expect(comment.id_product.toString()).toBe(testProduct._id.toString());
      expect(comment.id_user.toString()).toBe(testUser._id.toString());
      expect(comment.content).toBe('Sản phẩm rất tốt!');
      expect(comment.star).toBe(5);
    });

    test('should create comment with different star ratings', async () => {
      const ratings = [1, 2, 3, 4, 5];
      
      for (const rating of ratings) {
        const comment = await Comment.create({
          id_product: testProduct._id,
          id_user: testUser._id,
          content: `Rating ${rating} stars`,
          star: rating
        });

        expect(comment.star).toBe(rating);
      }

      const comments = await Comment.find();
      expect(comments).toHaveLength(5);
    });

    test('should create comment without star rating', async () => {
      const comment = await Comment.create({
        id_product: testProduct._id,
        id_user: testUser._id,
        content: 'No rating comment'
      });

      expect(comment).toBeDefined();
      expect(comment.content).toBe('No rating comment');
    });
  });

  describe('Comment Queries', () => {
    beforeEach(async () => {
      await Comment.create([
        {
          id_product: testProduct._id,
          id_user: testUser._id,
          content: 'Great product!',
          star: 5
        },
        {
          id_product: testProduct._id,
          id_user: testUser._id,
          content: 'Good quality',
          star: 4
        },
        {
          id_product: testProduct._id,
          id_user: testUser._id,
          content: 'Average',
          star: 3
        }
      ]);
    });

    test('should find all comments for a product', async () => {
      const comments = await Comment.find({ id_product: testProduct._id });
      expect(comments).toHaveLength(3);
    });

    test('should find comments by star rating', async () => {
      const fiveStarComments = await Comment.find({ star: 5 });
      expect(fiveStarComments).toHaveLength(1);
      expect(fiveStarComments[0].content).toBe('Great product!');
    });

    test('should find comments with high ratings', async () => {
      const highRatedComments = await Comment.find({ star: { $gte: 4 } });
      expect(highRatedComments).toHaveLength(2);
    });

    test('should find comments by user', async () => {
      const userComments = await Comment.find({ id_user: testUser._id });
      expect(userComments).toHaveLength(3);
    });
  });

  describe('Comment Updates', () => {
    test('should update comment content', async () => {
      const comment = await Comment.create({
        id_product: testProduct._id,
        id_user: testUser._id,
        content: 'Original comment',
        star: 4
      });

      comment.content = 'Updated comment';
      await comment.save();

      const updated = await Comment.findById(comment._id);
      expect(updated.content).toBe('Updated comment');
    });

    test('should update star rating', async () => {
      const comment = await Comment.create({
        id_product: testProduct._id,
        id_user: testUser._id,
        content: 'My review',
        star: 3
      });

      comment.star = 5;
      await comment.save();

      const updated = await Comment.findById(comment._id);
      expect(updated.star).toBe(5);
    });
  });

  describe('Comment Deletion', () => {
    test('should delete comment', async () => {
      const comment = await Comment.create({
        id_product: testProduct._id,
        id_user: testUser._id,
        content: 'Delete me',
        star: 2
      });

      await Comment.deleteOne({ _id: comment._id });
      
      const deleted = await Comment.findById(comment._id);
      expect(deleted).toBeNull();
    });
  });

  describe('Comment Statistics', () => {
    beforeEach(async () => {
      await Comment.create([
        { id_product: testProduct._id, id_user: testUser._id, content: 'Review 1', star: 5 },
        { id_product: testProduct._id, id_user: testUser._id, content: 'Review 2', star: 5 },
        { id_product: testProduct._id, id_user: testUser._id, content: 'Review 3', star: 4 },
        { id_product: testProduct._id, id_user: testUser._id, content: 'Review 4', star: 3 },
        { id_product: testProduct._id, id_user: testUser._id, content: 'Review 5', star: 2 }
      ]);
    });

    test('should count total comments', async () => {
      const count = await Comment.countDocuments({ id_product: testProduct._id });
      expect(count).toBe(5);
    });

    test('should calculate average rating', async () => {
      const comments = await Comment.find({ id_product: testProduct._id });
      const avgRating = comments.reduce((sum, c) => sum + c.star, 0) / comments.length;
      
      expect(avgRating).toBe(3.8);
    });
  });
});
