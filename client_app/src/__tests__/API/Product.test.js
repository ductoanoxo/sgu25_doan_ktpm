import axiosClient from '../../API/axiosClient';
import Product from '../../API/Product';

jest.mock('../../API/axiosClient');

describe('Product API', () => {
  const mockProducts = [
    {
      _id: '1',
      name_product: 'Product 1',
      price_product: '100000',
      image: 'img1.jpg',
      describe: 'Description 1',
      gender: 'male',
      id_category: 'cat1'
    },
    {
      _id: '2',
      name_product: 'Product 2',
      price_product: '200000',
      image: 'img2.jpg',
      describe: 'Description 2',
      gender: 'female',
      id_category: 'cat2'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get_All_Product', () => {
    test('fetches all products successfully', async () => {
      axiosClient.get.mockResolvedValue(mockProducts);
      
      const products = await Product.Get_All_Product();
      
      expect(axiosClient.get).toHaveBeenCalledWith('/api/Product');
      expect(products).toEqual(mockProducts);
    });

    test('handles error when fetching products', async () => {
      const errorMessage = 'Network Error';
      axiosClient.get.mockRejectedValue(new Error(errorMessage));
      
      await expect(Product.Get_All_Product()).rejects.toThrow(errorMessage);
    });
  });

  describe('Get_Detail_Product', () => {
    test('fetches product by id successfully', async () => {
      const mockProduct = mockProducts[0];
      axiosClient.get.mockResolvedValue(mockProduct);
      
      const product = await Product.Get_Detail_Product('1');
      
      expect(axiosClient.get).toHaveBeenCalledWith('/api/Product/1');
      expect(product).toEqual(mockProduct);
    });

    test('handles error when product not found', async () => {
      axiosClient.get.mockRejectedValue(new Error('Product not found'));
      
      await expect(Product.Get_Detail_Product('999')).rejects.toThrow('Product not found');
    });
  });

  describe('Get_Category_Product', () => {
    test('fetches products by category successfully', async () => {
      axiosClient.get.mockResolvedValue(mockProducts);
      
      const products = await Product.Get_Category_Product('?category=cat1');
      
      expect(axiosClient.get).toHaveBeenCalledWith('/api/Product/category?category=cat1');
      expect(products).toEqual(mockProducts);
    });

    test('returns empty array when no results found', async () => {
      axiosClient.get.mockResolvedValue([]);
      
      const results = await Product.Get_Category_Product('?category=nonexistent');
      
      expect(results).toEqual([]);
    });
  });

  describe('Get_Category_Gender', () => {
    test('fetches products by gender successfully', async () => {
      const maleProducts = [mockProducts[0]];
      axiosClient.get.mockResolvedValue(maleProducts);
      
      const products = await Product.Get_Category_Gender('?gender=male');
      
      expect(axiosClient.get).toHaveBeenCalledWith('/api/Product/category/gender?gender=male');
      expect(products).toEqual(maleProducts);
    });
  });

  describe('Get_Pagination', () => {
    test('fetches paginated products successfully', async () => {
      axiosClient.get.mockResolvedValue({ products: mockProducts, totalPages: 5 });

      const result = await Product.Get_Pagination('?page=1&limit=10');

      expect(axiosClient.get).toHaveBeenCalledWith('/api/Product/category/pagination?page=1&limit=10');
      expect(result).toEqual({ products: mockProducts, totalPages: 5 });
    });
  });

  describe('get_search_list', () => {
    test('searches products successfully', async () => {
      const searchResults = [mockProducts[0]];
      axiosClient.get.mockResolvedValue(searchResults);

      const result = await Product.get_search_list('?search=Product 1');

      expect(axiosClient.get).toHaveBeenCalledWith('/api/Product/scoll/page?search=Product 1');
      expect(result).toEqual(searchResults);
    });
  });
});
