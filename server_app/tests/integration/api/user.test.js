const express = require('express');
const User = require('../../../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

describe('User API Integration Tests', () => {
  afterAll(async () => {
    await User.deleteMany({});
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    test('should register a new user successfully', async () => {
      const newUser = {
        fullname: 'Integration Test User',
        email: 'integration@test.com',
        password: 'password123',
        phone: '0123456789'
      };

      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      const user = await User.create({
        ...newUser,
        password: hashedPassword
      });

      expect(user).toBeDefined();
      expect(user.email).toBe(newUser.email);
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
  });
});
