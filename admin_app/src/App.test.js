import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders admin application with login form', () => {
    render(<App />);
    // App renders the login form by default - check for heading
    const heading = screen.getByRole('heading', { name: /sign in/i });
    expect(heading).toBeInTheDocument();
  });

  test('renders email input field', () => {
    render(<App />);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    expect(emailInput).toBeInTheDocument();
  });

  test('renders password input field', () => {
    render(<App />);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  test('renders sign in button', () => {
    render(<App />);
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });
});
