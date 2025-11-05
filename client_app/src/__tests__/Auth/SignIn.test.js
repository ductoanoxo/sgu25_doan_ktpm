import User from '../../API/User';
import axiosClient from '../../API/axiosClient';

// Mock the axiosClient
jest.mock('../../API/axiosClient');

describe('User API - SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get_Detail_User (Login)', () => {
    test('should login successfully with correct credentials', async () => {
      const mockUser = {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        fullname: 'Test User'
      };
      
      axiosClient.get.mockResolvedValue(mockUser);

      const query = '?username=testuser&password=password123';
      const result = await User.Get_Detail_User(query);

      expect(axiosClient.get).toHaveBeenCalledWith(`/api/User/detail/login${query}`);
      expect(result).toEqual(mockUser);
    });

    test('should return error message when user not found', async () => {
      const errorMessage = 'Khong Tìm Thấy User';
      axiosClient.get.mockResolvedValue(errorMessage);

      const query = '?username=wronguser&password=password123';
      const result = await User.Get_Detail_User(query);

      expect(result).toEqual(errorMessage);
    });

    test('should return error message when password is incorrect', async () => {
      const errorMessage = 'Sai Mat Khau';
      axiosClient.get.mockResolvedValue(errorMessage);

      const query = '?username=testuser&password=wrongpassword';
      const result = await User.Get_Detail_User(query);

      expect(result).toEqual(errorMessage);
    });

    test('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      axiosClient.get.mockRejectedValue(networkError);

      const query = '?username=testuser&password=password123';
      
      await expect(User.Get_Detail_User(query)).rejects.toThrow('Network Error');
    });
  });

  describe('Post_User (Register)', () => {
    test('should register a new user successfully', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        fullname: 'New User'
      };

      const mockResponse = {
        _id: '2',
        ...newUser
      };

      axiosClient.post.mockResolvedValue(mockResponse);

      const result = await User.Post_User(newUser);

      expect(axiosClient.post).toHaveBeenCalledWith('/api/User', newUser);
      expect(result).toEqual(mockResponse);
    });

    test('should handle validation errors', async () => {
      const invalidUser = {
        username: '',
        email: 'invalid-email',
        password: '123'
      };

      const validationError = new Error('Validation error');
      axiosClient.post.mockRejectedValue(validationError);

      await expect(User.Post_User(invalidUser)).rejects.toThrow('Validation error');
    });
  });

  describe('Get_All_User', () => {
    test('should fetch all users', async () => {
      const mockUsers = [
        { _id: '1', username: 'user1', email: 'user1@example.com' },
        { _id: '2', username: 'user2', email: 'user2@example.com' }
      ];

      axiosClient.get.mockResolvedValue(mockUsers);

      const result = await User.Get_All_User();

      expect(axiosClient.get).toHaveBeenCalledWith('/api/User');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('Get_User', () => {
    test('should fetch user by id', async () => {
      const mockUser = {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com'
      };

      axiosClient.get.mockResolvedValue(mockUser);

      const result = await User.Get_User('1');

      expect(axiosClient.get).toHaveBeenCalledWith('/api/User/1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('Put_User', () => {
    test('should update user information', async () => {
      const updateData = {
        _id: '1',
        fullname: 'Updated Name',
        email: 'updated@example.com'
      };

      const mockResponse = {
        ...updateData,
        message: 'User updated successfully'
      };

      axiosClient.put.mockResolvedValue(mockResponse);

      const result = await User.Put_User(updateData);

      expect(axiosClient.put).toHaveBeenCalledWith('/api/User', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Change_Password', () => {
    test('should change password successfully', async () => {
      const passwordData = {
        _id: '1',
        oldPassword: 'oldpass123',
        newPassword: 'newpass123'
      };

      const mockResponse = {
        message: 'Password changed successfully'
      };

      axiosClient.post.mockResolvedValue(mockResponse);

      const result = await User.Change_Password(passwordData);

      expect(axiosClient.post).toHaveBeenCalledWith('/api/User/change-password', passwordData);
      expect(result).toEqual(mockResponse);
    });

    test('should handle incorrect old password', async () => {
      const passwordData = {
        _id: '1',
        oldPassword: 'wrongpass',
        newPassword: 'newpass123'
      };

      const error = new Error('Incorrect old password');
      axiosClient.post.mockRejectedValue(error);

      await expect(User.Change_Password(passwordData)).rejects.toThrow('Incorrect old password');
    });
  });
});
