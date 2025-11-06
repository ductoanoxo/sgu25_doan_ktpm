import User from '../../API/User';
import axiosClient from '../../API/axiosClient';

jest.mock('../../API/axiosClient');

describe('User API - SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Post_User (Registration)', () => {
    test('should register a new user successfully', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        fullname: 'New User',
        phone: '0123456789'
      };

      const mockResponse = {
        _id: '1',
        username: 'newuser',
        email: 'newuser@example.com',
        fullname: 'New User',
        phone: '0123456789'
      };

      axiosClient.post.mockResolvedValue(mockResponse);

      const result = await User.Post_User(newUser);

      expect(axiosClient.post).toHaveBeenCalledWith('/api/User', newUser);
      expect(result).toEqual(mockResponse);
    });

    test('should handle duplicate email error', async () => {
      const duplicateUser = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
        fullname: 'Existing User',
        phone: '0123456789'
      };

      const error = new Error('Email already exists');
      axiosClient.post.mockRejectedValue(error);

      await expect(User.Post_User(duplicateUser)).rejects.toThrow('Email already exists');
    });

    test('should handle validation errors for invalid data', async () => {
      const invalidUser = {
        username: '',
        email: 'invalid-email',
        password: '123',
        fullname: '',
        phone: 'invalid-phone'
      };

      const error = new Error('Validation error');
      axiosClient.post.mockRejectedValue(error);

      await expect(User.Post_User(invalidUser)).rejects.toThrow('Validation error');
    });

    test('should handle missing required fields', async () => {
      const incompleteUser = {
        email: 'user@example.com'
      };

      const error = new Error('Required fields missing');
      axiosClient.post.mockRejectedValue(error);

      await expect(User.Post_User(incompleteUser)).rejects.toThrow('Required fields missing');
    });

    test('should handle network errors', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        fullname: 'New User',
        phone: '0123456789'
      };

      const networkError = new Error('Network Error');
      axiosClient.post.mockRejectedValue(networkError);

      await expect(User.Post_User(newUser)).rejects.toThrow('Network Error');
    });
  });

  describe('Get_All_User', () => {
    test('should retrieve all registered users', async () => {
      const mockUsers = [
        { _id: '1', username: 'user1', email: 'user1@example.com', fullname: 'User One' },
        { _id: '2', username: 'user2', email: 'user2@example.com', fullname: 'User Two' },
        { _id: '3', username: 'user3', email: 'user3@example.com', fullname: 'User Three' }
      ];

      axiosClient.get.mockResolvedValue(mockUsers);

      const result = await User.Get_All_User();

      expect(axiosClient.get).toHaveBeenCalledWith('/api/User');
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(3);
    });

    test('should return empty array when no users exist', async () => {
      axiosClient.get.mockResolvedValue([]);

      const result = await User.Get_All_User();

      expect(result).toEqual([]);
    });
  });
});
