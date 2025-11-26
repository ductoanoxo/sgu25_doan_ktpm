const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Users = require('../../../Models/user');
const Permission = require('../../../Models/permission');
const bcrypt = require('bcryptjs');

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userController = require('../../../API/Controller/user.controller');
const userRouter = express.Router();

userRouter.get('/', userController.index);
userRouter.get('/detail', userController.detail);
userRouter.get('/:id', userController.user);
userRouter.post('/signup', userController.post_user);
userRouter.put('/update', userController.update_user);
userRouter.post('/change-password', userController.change_password);

app.use('/api/user', userRouter);

describe('User API Integration Tests', () => {
  let adminPermission;
  let customerPermission;
  let testUser;

  beforeEach(async () => {
    adminPermission = await Permission.create({ permission: 'Admin' });
    customerPermission = await Permission.create({ permission: 'Customer', isCustomer: true });
  });

  beforeEach(async () => {
    // Xóa và tạo lại user chính trước mỗi test để đảm bảo sự cô lập
    await Users.deleteMany({});
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('testpassword123', salt);
    testUser = await Users.create({
      username: 'testuser',
      password: hashedPassword,
      fullname: 'Test User',
      email: 'test@example.com',
      phone: '0123456789',
      gender: 'Nam',
      id_permission: adminPermission._id
    });
  });

  afterAll(async () => {
    await Users.deleteMany({});
    await Permission.deleteMany({});
  });

  describe('GET /api/user', () => {
    test('should get all users', async () => {
      const response = await request(app)
        .get('/api/user')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].username).toBe('testuser');
    });
  });

  describe('GET /api/user/:id', () => {
    test('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/user/${testUser._id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.username).toBe('testuser');
      expect(response.body.email).toBe('test@example.com');
    });

    test('should return null for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/user/${fakeId}`)
        .expect(200);

      expect(response.body).toBeNull();
    });
  });

  describe('GET /api/user/detail (Login)', () => {
    test('should login successfully with username and correct password', async () => {
      const response = await request(app)
        .get('/api/user/detail')
        .query({
          username: 'testuser',
          password: 'testpassword123'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.username).toBe('testuser');
      expect(response.body.email).toBe('test@example.com');
    });

    test('should login successfully with email and correct password', async () => {
      const response = await request(app)
        .get('/api/user/detail')
        .query({
          username: 'test@example.com',
          password: 'testpassword123'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.username).toBe('testuser');
    });

    test('should fail login with incorrect password', async () => {
      const response = await request(app)
        .get('/api/user/detail')
        .query({
          username: 'testuser',
          password: 'wrongpassword'
        })
        .expect(200);

      expect(response.text).toBe('Sai Mat Khau');
    });

    test('should fail login with non-existent user', async () => {
      const response = await request(app)
        .get('/api/user/detail')
        .query({
          username: 'nonexistent',
          password: 'anypassword'
        })
        .expect(200);

      expect(response.text).toBe('Khong Tìm Thấy User');
    });
  });

  describe('POST /api/user/signup', () => {
    test('should create new user successfully', async () => {
      const newUserData = {
        username: 'newuser',
        password: 'newpassword123',
        fullname: 'New User',
        email: 'new@example.com',
        phone: '0987654321',
        gender: 'Nữ'
      };

      const response = await request(app)
        .post('/api/user/signup')
        .send(newUserData)
        .expect(200);

      expect(response.text).toBe('Thanh Cong');

      // Verify user was created and password was hashed
      const createdUser = await Users.findOne({ username: 'newuser' });
      expect(createdUser).toBeDefined();
      expect(createdUser.fullname).toBe('New User');
      expect(createdUser.password).not.toBe('newpassword123');
      expect(createdUser.password.startsWith('$2')).toBe(true);
    });

    test('should fail to create duplicate user', async () => {
      const duplicateData = {
        username: 'testuser',
        password: 'password123',
        fullname: 'Duplicate User',
        email: 'duplicate@example.com'
      };

      const response = await request(app)
        .post('/api/user/signup')
        .send(duplicateData)
        .expect(200);

      expect(response.text).toBe('User Da Ton Tai');
    });
  });

  describe('PUT /api/user/update', () => {
    test('should update user information', async () => {
      const updateData = {
        _id: testUser._id,
        username: 'updateduser',
        fullname: 'Updated Name',
        password: 'newpassword456'
      };

      const response = await request(app)
        .put('/api/user/update')
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBe('Thanh Cong');

      // Verify update
      const updatedUser = await Users.findById(testUser._id);
      expect(updatedUser.username).toBe('updateduser');
      expect(updatedUser.fullname).toBe('Updated Name');
      expect(updatedUser.password).not.toBe('newpassword456');
      expect(updatedUser.password.startsWith('$2')).toBe(true);
    });
  });

  describe('POST /api/user/change-password', () => {
    test('should change password successfully', async () => {
      const changePasswordData = {
        userId: testUser._id,
        oldPassword: 'testpassword123',
        newPassword: 'newpassword789'
      };

      const response = await request(app)
        .post('/api/user/change-password')
        .send(changePasswordData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Đổi mật khẩu thành công');

      // Verify password was changed
      const updatedUser = await Users.findById(testUser._id);
      const isMatch = await bcrypt.compare('newpassword789', updatedUser.password);
      expect(isMatch).toBe(true);
    });

    test('should fail to change password with wrong old password', async () => {
      const changePasswordData = {
        userId: testUser._id,
        oldPassword: 'wrongoldpassword',
        newPassword: 'newpassword789'
      };

      const response = await request(app)
        .post('/api/user/change-password')
        .send(changePasswordData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Mật khẩu cũ không đúng');
    });

    test('should fail to change password for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const changePasswordData = {
        userId: fakeId,
        oldPassword: 'anypassword',
        newPassword: 'newpassword'
      };

      const response = await request(app)
        .post('/api/user/change-password')
        .send(changePasswordData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Không tìm thấy người dùng');
    });
  });
});
