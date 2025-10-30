const User = require('../../../Models/user');

describe('User Model Unit Tests', () => {
  describe('User Creation', () => {
    test('should create a valid user', async () => {
      const validUser = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '0123456789'
      };

      const user = new User(validUser);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.fullname).toBe(validUser.fullname);
      expect(savedUser.email).toBe(validUser.email);
      expect(savedUser.phone).toBe(validUser.phone);
    });

    test('should fail to create user without required fields', async () => {
      const invalidUser = new User({});
      
      let error;
      try {
        await invalidUser.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.errors).toBeDefined();
    });

    test('should fail to create user with duplicate email', async () => {
      const userData = {
        fullname: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
        phone: '0123456789'
      };

      const user1 = new User(userData);
      await user1.save();

      const user2 = new User(userData);
      
      let error;
      try {
        await user2.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Duplicate key error
    });

    test('should validate email format', async () => {
      const invalidEmailUser = {
        fullname: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        phone: '0123456789'
      };

      const user = new User(invalidEmailUser);
      
      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
    });
  });

  describe('User Methods', () => {
    test('should hash password before saving', async () => {
      const userData = {
        fullname: 'Test User',
        email: 'hash@example.com',
        password: 'plainPassword123',
        phone: '0123456789'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.password).toBeDefined();
      expect(savedUser.password).not.toBe(userData.password);
    });

    test('should update user information', async () => {
      const user = new User({
        fullname: 'Original Name',
        email: 'update@example.com',
        password: 'password123',
        phone: '0123456789'
      });

      await user.save();

      user.fullname = 'Updated Name';
      const updatedUser = await user.save();

      expect(updatedUser.fullname).toBe('Updated Name');
    });
  });
});
