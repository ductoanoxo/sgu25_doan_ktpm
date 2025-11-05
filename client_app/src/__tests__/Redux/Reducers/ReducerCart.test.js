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
  });

  describe('ADD_CART action', () => {
    test('should add a new item to an empty cart', () => {
      const newItem = { id_product: '1', count: 1 };
      const action = { type: 'ADD_CART', data: newItem };
      const newState = ReducerCart(initialState, action);
      expect(newState.listCart).toEqual([newItem]);
    });

    test('should add a new item to a non-empty cart', () => {
      const existingState = {
        ...initialState,
        listCart: [{ id_product: '1', count: 1 }]
      };
      const newItem = { id_product: '2', count: 2 };
      const action = { type: 'ADD_CART', data: newItem };
      const newState = ReducerCart(existingState, action);
      expect(newState.listCart).toEqual([...existingState.listCart, newItem]);
    });

    test('should update count if item already exists', () => {
      const existingState = {
        ...initialState,
        listCart: [{ id_product: '1', count: 1 }]
      };
      const updatedItem = { id_product: '1', count: 2 };
      const action = { type: 'ADD_CART', data: updatedItem };
      const newState = ReducerCart(existingState, action);
      expect(newState.listCart).toEqual([{ id_product: '1', count: 3 }]);
    });
  });

  describe('UPDATE_CART action', () => {
    test('should update the count of a specific item', () => {
      const existingState = {
        ...initialState,
        listCart: [{ _id: 'cart1', id_product: '1', count: 1 }]
      };
      const updateAction = { type: 'UPDATE_CART', data: { id_cart: 'cart1', count: 5 } };
      const newState = ReducerCart(existingState, updateAction);
      expect(newState.listCart).toEqual([{ _id: 'cart1', id_product: '1', count: 5 }]);
    });
  });

  describe('DELETE_CART action', () => {
    test('should delete a specific item from the cart', () => {
      const existingState = {
        ...initialState,
        listCart: [
          { _id: 'cart1', id_product: '1', count: 1 },
          { _id: 'cart2', id_product: '2', count: 1 }
        ]
      };
      const deleteAction = { type: 'DELETE_CART', data: { id_cart: 'cart1' } };
      const newState = ReducerCart(existingState, deleteAction);
      expect(newState.listCart).toEqual([{ _id: 'cart2', id_product: '2', count: 1 }]);
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
  });
});
