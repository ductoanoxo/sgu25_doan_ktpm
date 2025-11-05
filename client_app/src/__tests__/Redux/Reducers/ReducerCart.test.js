import ReducerCart from '../../../Redux/Reducer/ReducerCart';

describe('Cart Reducer', () => {
  const initialState = {
    id_user: '',
    listCart: []
  };

  describe('Initial State', () => {
    test('should return initial state', () => {
      expect(ReducerCart(undefined, {})).toEqual(initialState);
    });
  });

  describe('ADD_USER action', () => {
    test('should add user ID to state', () => {
      const userId = 'user123';
      const action = {
        type: 'ADD_USER',
        data: userId
      };

      const newState = ReducerCart(initialState, action);

      expect(newState.id_user).toBe(userId);
      expect(newState.listCart).toEqual([]);
    });

    test('should replace existing user ID', () => {
      const existingState = {
        id_user: 'oldUser',
        listCart: [{ id: 1, name: 'Item 1' }]
      };

      const action = {
        type: 'ADD_USER',
        data: 'newUser'
      };

      const newState = ReducerCart(existingState, action);

      expect(newState.id_user).toBe('newUser');
      expect(newState.listCart).toEqual(existingState.listCart);
    });

    test('should preserve listCart when updating user', () => {
      const cartItems = [
        { id_product: '1', name: 'Item 1', count: 2 },
        { id_product: '2', name: 'Item 2', count: 1 }
      ];

      const existingState = {
        id_user: 'user1',
        listCart: cartItems
      };

      const action = {
        type: 'ADD_USER',
        data: 'user2'
      };

      const newState = ReducerCart(existingState, action);

      expect(newState.id_user).toBe('user2');
      expect(newState.listCart).toEqual(cartItems);
    });
  });

  describe('Unknown action', () => {
    test('should return current state for unknown action', () => {
      const currentState = {
        id_user: 'user123',
        listCart: [{ id: 1, name: 'Item' }]
      };

      const action = {
        type: 'UNKNOWN_ACTION',
        data: 'some data'
      };

      const newState = ReducerCart(currentState, action);

      expect(newState).toEqual(currentState);
    });

    test('should not modify state', () => {
      const currentState = {
        id_user: 'user123',
        listCart: []
      };

      const action = {
        type: 'RANDOM_ACTION'
      };

      const newState = ReducerCart(currentState, action);

      expect(newState).toBe(currentState);
    });
  });

  describe('State immutability', () => {
    test('ADD_USER should not mutate original state', () => {
      const originalState = {
        id_user: 'original',
        listCart: [{ id: 1 }]
      };

      const stateCopy = { ...originalState };

      const action = {
        type: 'ADD_USER',
        data: 'newUser'
      };

      ReducerCart(originalState, action);

      // Original state should remain unchanged
      expect(originalState).toEqual(stateCopy);
    });
  });
});
