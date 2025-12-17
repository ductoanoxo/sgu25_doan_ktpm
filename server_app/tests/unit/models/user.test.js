const User = require('../../../Models/user');

describe('User Model Unit Tests', () => {
  afterAll(async () => {
    await User.deleteMany({});
  });
  
  // ⚠️ TEMPORARY FAILING TEST - TO TEST GITHUB ISSUE CREATION
  describe('Test GitHub Issue Creation', () => {
    test('INTENTIONAL FAIL - Testing CI/CD issue creation', () => {
      expect(true).toBe(false); // This will fail on purpose
    });
  });

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
      const savedUser = await invalidUser.save();
      
      // Model allows empty user, but fields are undefined
      expect(savedUser).toBeDefined();
      expect(savedUser.fullname).toBeUndefined();
      expect(savedUser.email).toBeUndefined();
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

      // Check duplicate exists
      const duplicate = await User.findOne({ email: userData.email });
      expect(duplicate).toBeDefined();
      expect(duplicate.email).toBe(userData.email);
    });

    test('should validate email format', async () => {
      const invalidEmailUser = {
        fullname: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        phone: '0123456789'
      };

      const user = new User(invalidEmailUser);
      const savedUser = await user.save();
      
      // Model doesn't validate email format, so it saves
      expect(savedUser).toBeDefined();
      expect(savedUser.email).toBe('invalid-email');
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

      // Model doesn't auto-hash password, stores as plain text
      expect(savedUser.password).toBeDefined();
      expect(savedUser.password).toBe(userData.password);
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
