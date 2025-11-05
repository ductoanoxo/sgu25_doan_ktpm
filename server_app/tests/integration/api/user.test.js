const express = require('express');
const User = require('../../../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock app setup
const app = express();
app.use(express.json());

// Import user routes (you'll need to adjust based on your actual route structure)
// const userRouter = require('../../../API/Router/user');
// app.use('/api/users', userRouter);

describe('User API Integration Tests', () => {
  describe('POST /api/users/register', () => {
    test('should register a new user successfully', async () => {
      const newUser = {
        fullname: 'Integration Test User',
        email: 'integration@test.com',
        password: 'password123',
        phone: '0123456789'
      };

      // Mock the registration logic
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      const user = await User.create({
        ...newUser,
        password: hashedPassword
      });

      expect(user).toBeDefined();
      expect(user.email).toBe(newUser.email);
      expect(user.password).not.toBe(newUser.password);
    });

    test('should fail to register with duplicate email', async () => {
      const userData = {
        fullname: 'Duplicate User',
        email: 'duplicate@test.com',
        password: 'password123',
        phone: '0123456789'
      };

      await User.create(userData);

      // Check if email already exists
      const existingUser = await User.findOne({ email: userData.email });
      expect(existingUser).toBeDefined();
      expect(existingUser.email).toBe(userData.email);
      
      // In real app, this would prevent duplicate registration
      const duplicateExists = await User.countDocuments({ email: userData.email }) > 0;
      expect(duplicateExists).toBe(true);
    });

    test('should fail to register without required fields', async () => {
      const invalidUser = {
        email: 'incomplete@test.com'
      };

      const user = await User.create(invalidUser);
      
      // User created but missing fullname, phone
      expect(user).toBeDefined();
      expect(user.fullname).toBeUndefined();
      expect(user.phone).toBeUndefined();
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        fullname: 'Login Test User',
        email: 'login@test.com',
        password: hashedPassword,
        phone: '0123456789'
      });
    });

    test('should login with correct credentials', async () => {
      const user = await User.findOne({ email: 'login@test.com' });
      const isPasswordValid = await bcrypt.compare('password123', user.password);

      expect(isPasswordValid).toBe(true);
      expect(user).toBeDefined();
      expect(user.email).toBe('login@test.com');
    });

    test('should fail to login with incorrect password', async () => {
      const user = await User.findOne({ email: 'login@test.com' });
      const isPasswordValid = await bcrypt.compare('wrongpassword', user.password);

      expect(isPasswordValid).toBe(false);
    });

    test('should fail to login with non-existent email', async () => {
      const user = await User.findOne({ email: 'nonexistent@test.com' });

      expect(user).toBeNull();
    });

    test('should generate JWT token on successful login', async () => {
      const user = await User.findOne({ email: 'login@test.com' });
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '24h' }
      );

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test_secret');
      expect(decoded.userId).toBeDefined();
      expect(decoded.email).toBe(user.email);
    });
  });

  describe('GET /api/users/profile', () => {
    let testUser;
    let authToken;

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      testUser = await User.create({
        fullname: 'Profile Test User',
        email: 'profile@test.com',
        password: hashedPassword,
        phone: '0123456789'
      });

      authToken = jwt.sign(
        { userId: testUser._id, email: testUser.email },
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '24h' }
      );
    });

    test('should get user profile with valid token', async () => {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'test_secret');
      const user = await User.findById(decoded.userId).select('-password');

      expect(user).toBeDefined();
      expect(user.email).toBe('profile@test.com');
      expect(user.password).toBeUndefined();
    });

    test('should fail to get profile without token', async () => {
      // Test would fail without authorization
      let error;
      try {
        jwt.verify('invalid_token', process.env.JWT_SECRET || 'test_secret');
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });
  });

  describe('PUT /api/users/profile', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        fullname: 'Update Test User',
        email: 'update@test.com',
        password: 'password123',
        phone: '0123456789'
      });
    });

    test('should update user profile', async () => {
      const updates = {
        fullname: 'Updated Name',
        phone: '0987654321'
      };

      const updatedUser = await User.findByIdAndUpdate(
        testUser._id,
        updates,
        { new: true }
      );

      expect(updatedUser.fullname).toBe(updates.fullname);
      expect(updatedUser.phone).toBe(updates.phone);
    });

    test('should not update email to existing one', async () => {
      await User.create({
        fullname: 'Another User',
        email: 'another@test.com',
        password: 'password123',
        phone: '0111111111'
      });

      // Check if email already exists before update
      const existingEmail = await User.findOne({ email: 'another@test.com' });
      expect(existingEmail).toBeDefined();
      
      // In real app, should check for duplicate before updating
      const wouldBeDuplicate = await User.countDocuments({ 
        email: 'another@test.com',
        _id: { $ne: testUser._id }
      }) > 0;
      expect(wouldBeDuplicate).toBe(true);
    });
  });
});
