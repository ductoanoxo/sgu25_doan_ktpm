import axios from 'axios';
import * as ProductAPI from '../../../API/Product';

jest.mock('axios');

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
      axios.get.mockResolvedValue({ data: mockProducts });
      
      const products = await ProductAPI.getProducts();
      
      expect(axios.get).toHaveBeenCalledWith('/api/products');
      expect(products).toEqual(mockProducts);
    });

    test('handles error when fetching products', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValue(new Error(errorMessage));
      
      await expect(ProductAPI.getProducts()).rejects.toThrow(errorMessage);
    });
  });

  describe('getProductById', () => {
    test('fetches product by id successfully', async () => {
      const mockProduct = mockProducts[0];
      axios.get.mockResolvedValue({ data: mockProduct });
      
      const product = await ProductAPI.getProductById('1');
      
      expect(axios.get).toHaveBeenCalledWith('/api/products/1');
      expect(product).toEqual(mockProduct);
    });

    test('handles error when product not found', async () => {
      axios.get.mockRejectedValue(new Error('Product not found'));
      
      await expect(ProductAPI.getProductById('999')).rejects.toThrow('Product not found');
    });
  });

  describe('searchProducts', () => {
    test('searches products by keyword successfully', async () => {
      const searchResults = [mockProducts[0]];
      axios.get.mockResolvedValue({ data: searchResults });
      
      const results = await ProductAPI.searchProducts('Product 1');
      
      expect(axios.get).toHaveBeenCalledWith('/api/products/search', {
        params: { keyword: 'Product 1' }
      });
      expect(results).toEqual(searchResults);
    });

    test('returns empty array when no results found', async () => {
      axios.get.mockResolvedValue({ data: [] });
      
      const results = await ProductAPI.searchProducts('NonexistentProduct');
      
      expect(results).toEqual([]);
    });
  });

  describe('getProductsByCategory', () => {
    test('fetches products by category successfully', async () => {
      axios.get.mockResolvedValue({ data: mockProducts });
      
      const products = await ProductAPI.getProductsByCategory('category1');
      
      expect(axios.get).toHaveBeenCalledWith('/api/products/category/category1');
      expect(products).toEqual(mockProducts);
    });
  });

  describe('filterProducts', () => {
    test('filters products by price range', async () => {
      const filteredProducts = [mockProducts[0]];
      axios.get.mockResolvedValue({ data: filteredProducts });
      
      const products = await ProductAPI.filterProducts({
        minPrice: 50000,
        maxPrice: 150000
      });
      
      expect(axios.get).toHaveBeenCalledWith('/api/products/filter', {
        params: {
          minPrice: 50000,
          maxPrice: 150000
        }
      });
      expect(products).toEqual(filteredProducts);
    });
  });
});
