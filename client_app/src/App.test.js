import React from 'react';

describe('App Component', () => {
  test('App module exports correctly', () => {
    const App = require('./App').default;
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });

  test('Store is configured correctly', () => {
    const store = require('./store').default;
    expect(store).toBeDefined();
    expect(store.getState).toBeDefined();
    expect(typeof store.getState).toBe('function');
  });

  test('Redux store has initial state', () => {
    const store = require('./store').default;
    const state = store.getState();
    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
  });
});
