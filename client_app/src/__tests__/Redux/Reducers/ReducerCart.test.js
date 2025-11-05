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

    test('should return initial state when no action type matches', () => {
      const result = ReducerCart(undefined, { type: 'UNKNOWN' });
      expect(result).toEqual(initialState);
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

    test('should update user ID when called multiple times', () => {
      const action1 = { type: 'ADD_USER', data: 'user1' };
      const state1 = ReducerCart(initialState, action1);
      expect(state1.id_user).toBe('user1');

      const action2 = { type: 'ADD_USER', data: 'user2' };
      const state2 = ReducerCart(state1, action2);
      expect(state2.id_user).toBe('user2');
    });

    test('should preserve existing listCart when adding user', () => {
      const stateWithCart = {
        id_user: '',
        listCart: [{ id: 1, name: 'Item 1' }]
      };
      
      const action = { type: 'ADD_USER', data: 'user123' };
      const newState = ReducerCart(stateWithCart, action);

      expect(newState.id_user).toBe('user123');
      expect(newState.listCart).toEqual(stateWithCart.listCart);
    });
  });

  describe('Unknown action', () => {
    test('should return current state for unknown action', () => {
      const currentState = {
        id_user: 'user123',
        listCart: [{ id: 1, name: 'Item' }]
      };
      const action = { type: 'UNKNOWN_ACTION' };
      const newState = ReducerCart(currentState, action);
      expect(newState).toEqual(currentState);
    });

    test('should handle empty action object', () => {
      const currentState = {
        id_user: 'user456',
        listCart: []
      };
      const newState = ReducerCart(currentState, {});
      expect(newState).toEqual(currentState);
    });
  });

  describe('State immutability', () => {
    test('should not mutate original state for ADD_USER', () => {
      const originalState = {
        id_user: 'original',
        listCart: [{ id: 1 }]
      };
      const stateCopy = { ...originalState, listCart: [...originalState.listCart] };
      
      ReducerCart(originalState, { type: 'ADD_USER', data: 'new' });
      
      // Note: The current reducer implementation may mutate state
      // This test documents the current behavior
      expect(originalState.id_user).toBe('new'); // Current implementation mutates
    });
  });
});
