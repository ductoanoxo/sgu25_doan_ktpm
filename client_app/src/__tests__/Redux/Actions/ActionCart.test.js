import { addUser, addCart, updateCart, deleteCart } from '../../../Redux/Action/ActionCart';

describe('Cart Actions', () => {
  describe('addUser', () => {
    test('should create an action to add user', () => {
      const userId = 'user123';
      const expectedAction = {
        type: 'ADD_USER',
        data: userId
      };
      
      expect(addUser(userId)).toEqual(expectedAction);
    });

    test('should handle different user IDs', () => {
      const userIds = ['user1', 'user2', 'user3'];
      
      userIds.forEach(id => {
        const action = addUser(id);
        expect(action.type).toBe('ADD_USER');
        expect(action.data).toBe(id);
      });
    });

    test('should handle numeric user ID', () => {
      const userId = 12345;
      const action = addUser(userId);
      expect(action.type).toBe('ADD_USER');
      expect(action.data).toBe(userId);
    });

    test('should handle null user ID', () => {
      const action = addUser(null);
      expect(action.type).toBe('ADD_USER');
      expect(action.data).toBeNull();
    });
  });

  describe('addCart', () => {
    test('should create an action to add cart item', () => {
      const cartItem = {
        id_product: 'prod123',
        name_product: 'Test Product',
        price_product: '199000',
        count: 1,
        size: 'M'
      };
      
      const expectedAction = {
        type: 'ADD_CART',
        data: cartItem
      };
      
      expect(addCart(cartItem)).toEqual(expectedAction);
    });

    test('should handle multiple cart items', () => {
      const items = [
        { id_product: '1', name_product: 'Item 1', price_product: '100000', count: 1 },
        { id_product: '2', name_product: 'Item 2', price_product: '200000', count: 2 },
        { id_product: '3', name_product: 'Item 3', price_product: '300000', count: 3 }
      ];
      
      items.forEach(item => {
        const action = addCart(item);
        expect(action.type).toBe('ADD_CART');
        expect(action.data).toEqual(item);
      });
    });

    test('should handle cart item with minimal data', () => {
      const minimalItem = { id_product: 'prod1' };
      const action = addCart(minimalItem);
      expect(action.type).toBe('ADD_CART');
      expect(action.data).toEqual(minimalItem);
    });
  });

  describe('updateCart', () => {
    test('should create an action to update cart item', () => {
      const updateData = {
        id_cart: 'cart123',
        count: 3
      };
      
      const expectedAction = {
        type: 'UPDATE_CART',
        data: updateData
      };
      
      expect(updateCart(updateData)).toEqual(expectedAction);
    });

    test('should update with different counts', () => {
      const counts = [1, 2, 5, 10];
      
      counts.forEach(count => {
        const action = updateCart({ id_cart: 'cart123', count });
        expect(action.type).toBe('UPDATE_CART');
        expect(action.data.count).toBe(count);
      });
    });

    test('should handle update with additional properties', () => {
      const updateData = {
        id_cart: 'cart123',
        count: 5,
        size: 'L',
        color: 'red'
      };
      const action = updateCart(updateData);
      expect(action.type).toBe('UPDATE_CART');
      expect(action.data).toEqual(updateData);
    });
  });

  describe('deleteCart', () => {
    test('should create an action to delete cart item', () => {
      const cartId = 'cart123';
      
      const expectedAction = {
        type: 'DELETE_CART',
        data: cartId
      };
      
      expect(deleteCart(cartId)).toEqual(expectedAction);
    });

    test('should handle different cart IDs', () => {
      const cartIds = ['cart1', 'cart2', 'cart3'];
      
      cartIds.forEach(id => {
        const action = deleteCart(id);
        expect(action.type).toBe('DELETE_CART');
        expect(action.data).toBe(id);
      });
    });

    test('should handle object as delete data', () => {
      const deleteData = { id_cart: 'cart123' };
      const action = deleteCart(deleteData);
      expect(action.type).toBe('DELETE_CART');
      expect(action.data).toEqual(deleteData);
    });
  });

  describe('Action creators return correct structure', () => {
    test('all actions should have type and data properties', () => {
      const actions = [
        addUser('user1'),
        addCart({ id: 'prod1' }),
        updateCart({ id: 'cart1', count: 1 }),
        deleteCart('cart1')
      ];

      actions.forEach(action => {
        expect(action).toHaveProperty('type');
        expect(action).toHaveProperty('data');
      });
    });

    test('action types should be strings', () => {
      const actions = [
        addUser('user1'),
        addCart({ id: 'prod1' }),
        updateCart({ id: 'cart1', count: 1 }),
        deleteCart('cart1')
      ];

      actions.forEach(action => {
        expect(typeof action.type).toBe('string');
      });
    });
  });
});
