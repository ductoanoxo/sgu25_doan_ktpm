import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AuthContextProvider, { AuthContext } from '../../component/context/Auth';

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Context Provider', () => {
    test('should provide initial values', () => {
      let contextValue;
      
      const TestComponent = () => {
        contextValue = React.useContext(AuthContext);
        return <div>Test</div>;
      };

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      expect(contextValue).toBeDefined();
      expect(contextValue.jwt).toBeUndefined();
      expect(contextValue.user).toBeUndefined();
      expect(typeof contextValue.addLocal).toBe('function');
      expect(typeof contextValue.logOut).toBe('function');
    });

    test('should load jwt and user from localStorage', async () => {
      const mockJwt = 'mock-jwt-token';
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
      
      localStorage.setItem('jwt', JSON.stringify(mockJwt));
      localStorage.setItem('user', JSON.stringify(mockUser));

      let contextValue;
      
      const TestComponent = () => {
        contextValue = React.useContext(AuthContext);
        return <div>Test</div>;
      };

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      await waitFor(() => {
        expect(contextValue.jwt).toBe(mockJwt);
        expect(contextValue.user).toEqual(mockUser);
      });
    });
  });

  describe('addLocal function', () => {
    test('should add jwt and user to localStorage and state', async () => {
      const mockJwt = 'new-jwt-token';
      const mockUser = { id: '2', username: 'newuser', email: 'new@example.com' };

      let contextValue;
      
      const TestComponent = () => {
        contextValue = React.useContext(AuthContext);
        
        return (
          <button onClick={() => contextValue.addLocal(mockJwt, mockUser)}>
            Add Local
          </button>
        );
      };

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      const button = screen.getByText('Add Local');
      button.click();

      await waitFor(() => {
        expect(localStorage.getItem('jwt')).toBe(JSON.stringify(mockJwt));
        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
        expect(contextValue.jwt).toBe(mockJwt);
        expect(contextValue.user).toEqual(mockUser);
      });
    });

    test('should update existing jwt and user', async () => {
      const initialJwt = 'initial-jwt';
      const initialUser = { id: '1', username: 'initial' };
      
      localStorage.setItem('jwt', JSON.stringify(initialJwt));
      localStorage.setItem('user', JSON.stringify(initialUser));

      const newJwt = 'updated-jwt';
      const newUser = { id: '2', username: 'updated' };

      let contextValue;
      
      const TestComponent = () => {
        contextValue = React.useContext(AuthContext);
        
        return (
          <button onClick={() => contextValue.addLocal(newJwt, newUser)}>
            Update
          </button>
        );
      };

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      const button = screen.getByText('Update');
      button.click();

      await waitFor(() => {
        expect(localStorage.getItem('jwt')).toBe(JSON.stringify(newJwt));
        expect(localStorage.getItem('user')).toBe(JSON.stringify(newUser));
        expect(contextValue.jwt).toBe(newJwt);
        expect(contextValue.user).toEqual(newUser);
      });
    });
  });

  describe('logOut function', () => {
    test('should clear jwt and user from localStorage and state', async () => {
      const mockJwt = 'logout-jwt-token';
      const mockUser = { id: '3', username: 'logoutuser' };
      
      localStorage.setItem('jwt', JSON.stringify(mockJwt));
      localStorage.setItem('user', JSON.stringify(mockUser));

      let contextValue;
      
      const TestComponent = () => {
        contextValue = React.useContext(AuthContext);
        
        return (
          <button onClick={() => contextValue.logOut()}>
            Log Out
          </button>
        );
      };

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      const button = screen.getByText('Log Out');
      button.click();

      await waitFor(() => {
        expect(localStorage.getItem('jwt')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(contextValue.jwt).toBeUndefined();
        expect(contextValue.user).toBeUndefined();
      });
    });

    test('should handle logout when already logged out', async () => {
      let contextValue;
      
      const TestComponent = () => {
        contextValue = React.useContext(AuthContext);
        
        return (
          <button onClick={() => contextValue.logOut()}>
            Log Out
          </button>
        );
      };

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      const button = screen.getByText('Log Out');
      button.click();

      await waitFor(() => {
        expect(localStorage.getItem('jwt')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(contextValue.jwt).toBeUndefined();
        expect(contextValue.user).toBeUndefined();
      });
    });
  });
});
