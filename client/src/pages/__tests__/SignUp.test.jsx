import { render, screen } from '@testing-library/react';
import Signup from '../Signup';
import { BrowserRouter } from 'react-router-dom';

test('renders Signup form', () => {
  render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );

  expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});
