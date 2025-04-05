import { render, screen, waitFor } from '@testing-library/react';
import Todo from '../Todo';
import { BrowserRouter } from 'react-router-dom';
import axios from '../../api/axios';

// 🔄 Mock axios
jest.mock('../../api/axios');

const mockTasks = [
  {
    _id: '1',
    title: 'Test Task 1',
    description: 'Description for test task 1',
  },
  {
    _id: '2',
    title: 'Test Task 2',
    description: 'Description for test task 2',
  },
];

describe('Todo Page', () => {
  beforeEach(() => {
    // Mock the GET /tasks API call
    axios.get.mockResolvedValue({ data: mockTasks });
  });

  it('renders task list from API', async () => {
    render(
      <BrowserRouter>
        <Todo />
      </BrowserRouter>
    );

    // Wait for tasks to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  it('renders form elements correctly', () => {
    render(
      <BrowserRouter>
        <Todo />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });
});
