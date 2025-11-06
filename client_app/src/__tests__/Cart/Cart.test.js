import { createStore } from 'redux';

// Simple cart reducer for testing
const cartReducer = (state = { cart: [] }, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item._id !== action.payload) };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item._id === action.payload._id ? { ...item, count: action.payload.count } : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
};

describe('Cart Functionality', () => {
  let store;

  beforeEach(() => {
    store = createStore(cartReducer);
  });

  describe('Cart State Management', () => {
    test('should start with empty cart', () => {
      const state = store.getState();
      expect(state.cart).toEqual([]);
    });

    test('should add item to cart', () => {
      const item = {
        _id: '1',
        idProduct: 'prod1',
        nameProduct: 'Test Product 1',
        priceProduct: 100000,
        count: 2,
        img: 'test1.jpg'
      };

      store.dispatch({ type: 'ADD_TO_CART', payload: item });

      const state = store.getState();
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0]).toEqual(item);
    });

    test('should add multiple items to cart', () => {
      const items = [
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

      items.forEach(item => {
        store.dispatch({ type: 'ADD_TO_CART', payload: item });
      });

      const state = store.getState();
      expect(state.cart).toHaveLength(2);
    });

    test('should update item quantity in cart', () => {
      const item = {
        _id: '1',
        idProduct: 'prod1',
        nameProduct: 'Test Product 1',
        priceProduct: 100000,
        count: 2,
        img: 'test1.jpg'
      };

      store.dispatch({ type: 'ADD_TO_CART', payload: item });
      store.dispatch({ type: 'UPDATE_CART_ITEM', payload: { _id: '1', count: 5 } });

      const state = store.getState();
      expect(state.cart[0].count).toBe(5);
    });

    test('should remove item from cart', () => {
      const items = [
        { _id: '1', nameProduct: 'Product 1', priceProduct: 100000, count: 2 },
        { _id: '2', nameProduct: 'Product 2', priceProduct: 200000, count: 1 }
      ];

      items.forEach(item => {
        store.dispatch({ type: 'ADD_TO_CART', payload: item });
      });

      store.dispatch({ type: 'REMOVE_FROM_CART', payload: '1' });

      const state = store.getState();
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0]._id).toBe('2');
    });

    test('should clear entire cart', () => {
      const items = [
        { _id: '1', nameProduct: 'Product 1', priceProduct: 100000, count: 2 },
        { _id: '2', nameProduct: 'Product 2', priceProduct: 200000, count: 1 }
      ];

      items.forEach(item => {
        store.dispatch({ type: 'ADD_TO_CART', payload: item });
      });

      store.dispatch({ type: 'CLEAR_CART' });

      const state = store.getState();
      expect(state.cart).toEqual([]);
    });
  });

  describe('Cart Calculations', () => {
    test('should calculate total price correctly', () => {
      const items = [
        { _id: '1', priceProduct: 100000, count: 2 },
        { _id: '2', priceProduct: 200000, count: 1 }
      ];

      items.forEach(item => {
        store.dispatch({ type: 'ADD_TO_CART', payload: item });
      });

      const state = store.getState();
      const total = state.cart.reduce((sum, item) => sum + (item.priceProduct * item.count), 0);
      
      // Total = (100000 * 2) + (200000 * 1) = 400000
      expect(total).toBe(400000);
    });

    test('should calculate total items count', () => {
      const items = [
        { _id: '1', priceProduct: 100000, count: 2 },
        { _id: '2', priceProduct: 200000, count: 3 }
      ];

      items.forEach(item => {
        store.dispatch({ type: 'ADD_TO_CART', payload: item });
      });

      const state = store.getState();
      const totalItems = state.cart.reduce((sum, item) => sum + item.count, 0);
      
      expect(totalItems).toBe(5);
    });
  });
});
