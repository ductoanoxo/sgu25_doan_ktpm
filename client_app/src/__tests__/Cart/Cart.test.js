import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Cart from '../../Cart/Cart';
import * as CartAPI from '../../API/CartAPI';

jest.mock('../../API/CartAPI');

const mockStore = configureStore([]);

const renderWithProviders = (component, initialState = { Count: { isLoad: false }, Cart: { cart: [] }, Session: {} }) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Cart Component', () => {
  const mockCartItems = [
    {
      _id: '1',
      idProduct: 'prod1',
      nameProduct: 'Test Product 1',
      priceProduct: 100000,
      count: 2,
      img: 'test1.jpg'
    },
    {
      _id: '2',
      idProduct: 'prod2',
      nameProduct: 'Test Product 2',
      priceProduct: 200000,
      count: 1,
      img: 'test2.jpg'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty cart message when no items', () => {
    CartAPI.getCart = jest.fn().mockResolvedValue([]);
    
    renderWithProviders(<Cart />);
    
    waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });

  test('renders cart items', async () => {
    CartAPI.getCart = jest.fn().mockResolvedValue(mockCartItems);
    
    renderWithProviders(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });
  });

  test('calculates total price correctly', async () => {
    CartAPI.getCart = jest.fn().mockResolvedValue(mockCartItems);
    
    renderWithProviders(<Cart />);
    
    await waitFor(() => {
      // Total = (100000 * 2) + (200000 * 1) = 400000
      expect(screen.getByText(/400,000/)).toBeInTheDocument();
    });
  });

  test('updates item quantity', async () => {
    CartAPI.getCart = jest.fn().mockResolvedValue(mockCartItems);
    CartAPI.updateCart = jest.fn().mockResolvedValue({ success: true });
    
    renderWithProviders(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const increaseButton = screen.getAllByRole('button', { name: /\+/i })[0];
    await userEvent.click(increaseButton);

    await waitFor(() => {
      expect(CartAPI.updateCart).toHaveBeenCalledWith(
        expect.objectContaining({
          count: 3
        })
      );
    });
  });

  test('removes item from cart', async () => {
    CartAPI.getCart = jest.fn().mockResolvedValue(mockCartItems);
    CartAPI.deleteCart = jest.fn().mockResolvedValue({ success: true });
    
    renderWithProviders(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    await userEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(CartAPI.deleteCart).toHaveBeenCalledWith('1');
    });
  });

  test('navigates to checkout on button click', async () => {
    CartAPI.getCart = jest.fn().mockResolvedValue(mockCartItems);
    
    renderWithProviders(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const checkoutButton = screen.getByRole('button', { name: /checkout/i });
    expect(checkoutButton).toBeInTheDocument();
  });

  test('displays loading state', () => {
    CartAPI.getCart = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve([]), 1000))
    );
    
    renderWithProviders(<Cart />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    CartAPI.getCart = jest.fn().mockRejectedValue(new Error('Failed to fetch cart'));
    
    renderWithProviders(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading cart/i)).toBeInTheDocument();
    });
  });
});
