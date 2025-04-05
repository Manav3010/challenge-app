import { render, screen } from '@testing-library/react';
import Login from '../Login';
import { BrowserRouter } from 'react-router-dom';

test('renders Login form', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // Assertion: Check if login form elements are present
  expect(screen.getByText(/login/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
});
