import productAPI from '../../component/Api/productAPI';
import axiosClient from '../../component/Api/axiosClient';

// Mock axiosClient
jest.mock('../../component/Api/axiosClient');

describe('Product API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAPI', () => {
    test('should call GET request with query params', async () => {
      const mockData = [{ id: '1', name: 'Product 1' }];
      axiosClient.get.mockResolvedValue(mockData);

      const query = '?page=1&limit=10';
      const result = await productAPI.getAPI(query);

      expect(axiosClient.get).toHaveBeenCalledWith(`/admin/product${query}`);
      expect(result).toEqual(mockData);
    });

    test('should call GET request without query params', async () => {
      const mockData = [];
      axiosClient.get.mockResolvedValue(mockData);

      const result = await productAPI.getAPI('');

      expect(axiosClient.get).toHaveBeenCalledWith('/admin/product');
      expect(result).toEqual(mockData);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Network error');
      axiosClient.get.mockRejectedValue(mockError);

      await expect(productAPI.getAPI('?page=1')).rejects.toThrow('Network error');
    });
  });

  describe('details', () => {
    test('should call GET request with product id', async () => {
      const mockProduct = { 
        id: '123', 
        name: 'Test Product', 
        price: 100000 
      };
      axiosClient.get.mockResolvedValue(mockProduct);

      const result = await productAPI.details('123');

      expect(axiosClient.get).toHaveBeenCalledWith('/admin/product/123');
      expect(result).toEqual(mockProduct);
    });

    test('should handle non-existent product', async () => {
      axiosClient.get.mockResolvedValue(null);

      const result = await productAPI.details('999');

      expect(axiosClient.get).toHaveBeenCalledWith('/admin/product/999');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    test('should call POST request to create product', async () => {
      const newProduct = {
        name_product: 'New Product',
        price_product: '200000',
        image: 'newproduct.jpg',
        describe: 'New description'
      };
      
      const mockResponse = { 
        id: '456', 
        ...newProduct,
        message: 'Product created successfully'
      };
      
      axiosClient.post.mockResolvedValue(mockResponse);

      const result = await productAPI.create(newProduct);

      expect(axiosClient.post).toHaveBeenCalledWith('/admin/product/create', newProduct);
      expect(result).toEqual(mockResponse);
    });

    test('should handle validation errors', async () => {
      const invalidProduct = { name_product: '' };
      const mockError = new Error('Validation error');
      
      axiosClient.post.mockRejectedValue(mockError);

      await expect(productAPI.create(invalidProduct)).rejects.toThrow('Validation error');
    });
  });

  describe('update', () => {
    test('should call PATCH request to update product', async () => {
      const updateData = {
        id: '123',
        name_product: 'Updated Product',
        price_product: '250000'
      };
      
      const mockResponse = { 
        ...updateData,
        message: 'Product updated successfully'
      };
      
      axiosClient.patch.mockResolvedValue(mockResponse);

      const result = await productAPI.update(updateData);

      expect(axiosClient.patch).toHaveBeenCalledWith('/admin/product/update', updateData);
      expect(result).toEqual(mockResponse);
    });

    test('should handle update errors', async () => {
      const updateData = { id: '999', name_product: 'Non-existent' };
      const mockError = new Error('Product not found');
      
      axiosClient.patch.mockRejectedValue(mockError);

      await expect(productAPI.update(updateData)).rejects.toThrow('Product not found');
    });
  });

  describe('delete', () => {
    test('should call DELETE request with product id', async () => {
      const mockResponse = { 
        message: 'Product deleted successfully'
      };
      
      axiosClient.delete.mockResolvedValue(mockResponse);

      const query = '?id=123';
      const result = await productAPI.delete(query);

      expect(axiosClient.delete).toHaveBeenCalledWith(`/admin/product/delete${query}`);
      expect(result).toEqual(mockResponse);
    });

    test('should handle delete errors', async () => {
      const mockError = new Error('Cannot delete product');
      axiosClient.delete.mockRejectedValue(mockError);

      await expect(productAPI.delete('?id=123')).rejects.toThrow('Cannot delete product');
    });
  });

  describe('getAll', () => {
    test('should call GET request to fetch all products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 100000 },
        { id: '2', name: 'Product 2', price: 200000 },
        { id: '3', name: 'Product 3', price: 300000 }
      ];
      
      axiosClient.get.mockResolvedValue(mockProducts);

      const result = await productAPI.getAll();

      expect(axiosClient.get).toHaveBeenCalledWith('/product');
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(3);
    });

    test('should return empty array when no products', async () => {
      axiosClient.get.mockResolvedValue([]);

      const result = await productAPI.getAll();

      expect(axiosClient.get).toHaveBeenCalledWith('/product');
      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    test('should propagate network errors', async () => {
      const networkError = new Error('Network request failed');
      axiosClient.get.mockRejectedValue(networkError);

      await expect(productAPI.getAll()).rejects.toThrow('Network request failed');
    });

    test('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      axiosClient.post.mockRejectedValue(timeoutError);

      await expect(productAPI.create({})).rejects.toThrow('Request timeout');
    });

    test('should handle unauthorized errors', async () => {
      const authError = new Error('Unauthorized');
      axiosClient.get.mockRejectedValue(authError);

      await expect(productAPI.getAPI('')).rejects.toThrow('Unauthorized');
    });
  });
});
