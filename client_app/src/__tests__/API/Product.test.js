import axiosClient from '../../API/axiosClient';
import * as ProductAPI from '../../API/Product';

jest.mock('../../API/axiosClient');

describe('Product API', () => {
  const mockProducts = [
    {
      _id: '1',
      name_product: 'Product 1',
      price_product: 100000,
      count_product: 10,
      img1: 'img1.jpg'
    },
    {
      _id: '2',
      name_product: 'Product 2',
      price_product: 200000,
      count_product: 5,
      img2: 'img2.jpg'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    test('fetches all products successfully', async () => {
      axiosClient.get.mockResolvedValue(mockProducts);
      
      const products = await ProductAPI.getProducts();
      
      expect(axiosClient.get).toHaveBeenCalledWith('/products');
      expect(products).toEqual(mockProducts);
    });

    test('handles error when fetching products', async () => {
      const errorMessage = 'Network Error';
      axiosClient.get.mockRejectedValue(new Error(errorMessage));
      
      await expect(ProductAPI.getProducts()).rejects.toThrow(errorMessage);
    });
  });

  describe('getProductById', () => {
    test('fetches product by id successfully', async () => {
      const mockProduct = mockProducts[0];
      axiosClient.get.mockResolvedValue(mockProduct);
      
      const product = await ProductAPI.getProductById('1');
      
      expect(axiosClient.get).toHaveBeenCalledWith('/products/1');
      expect(product).toEqual(mockProduct);
    });

    test('handles error when product not found', async () => {
        axiosClient.get.mockRejectedValue(new Error('Product not found'));
      
      await expect(ProductAPI.getProductById('999')).rejects.toThrow('Product not found');
    });
  });

  describe('searchProducts', () => {
    test('searches products by keyword successfully', async () => {
      const searchResults = [mockProducts[0]];
      axiosClient.get.mockResolvedValue(searchResults);
      
      const results = await ProductAPI.searchProducts('Product 1');
      
      expect(axiosClient.get).toHaveBeenCalledWith('/products/search/Product 1');
      expect(results).toEqual(searchResults);
    });

    test('returns empty array when no results found', async () => {
        axiosClient.get.mockResolvedValue([]);
      
      const results = await ProductAPI.searchProducts('NonexistentProduct');
      
      expect(results).toEqual([]);
    });
  });

  describe('getProductsByCategory', () => {
    test('fetches products by category successfully', async () => {
        axiosClient.get.mockResolvedValue(mockProducts);
      
      const products = await ProductAPI.getProductsByCategory('category1');
      
      expect(axiosClient.get).toHaveBeenCalledWith('/products/category/category1');
      expect(products).toEqual(mockProducts);
    });
  });

  describe('createProduct', () => {
    test('creates a new product successfully', async () => {
      const newProduct = { name: 'New Product', price: 150 };
      axiosClient.post.mockResolvedValue(newProduct);

      const result = await ProductAPI.createProduct(newProduct);

      expect(axiosClient.post).toHaveBeenCalledWith('/products', newProduct);
      expect(result).toEqual(newProduct);
    });
  });

  describe('updateProduct', () => {
    test('updates a product successfully', async () => {
      const updatedProduct = { name: 'Updated Product', price: 200 };
      axiosClient.put.mockResolvedValue(updatedProduct);

      const result = await ProductAPI.updateProduct('1', updatedProduct);

      expect(axiosClient.put).toHaveBeenCalledWith('/products/1', updatedProduct);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    test('deletes a product successfully', async () => {
      const deleteResponse = { message: 'Product deleted' };
      axiosClient.delete.mockResolvedValue(deleteResponse);

      const result = await ProductAPI.deleteProduct('1');

      expect(axiosClient.delete).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(deleteResponse);
    });
  });
});
