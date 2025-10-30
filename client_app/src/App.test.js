import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

test('renders the app header', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  // App header contains the contact text 'Telephone Enquiry:' in the template
  const headerText = screen.getByText(/telephone enquiry/i);
  expect(headerText).toBeInTheDocument();
});
