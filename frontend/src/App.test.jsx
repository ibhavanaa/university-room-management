// src/App.test.jsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Classroom Management System/i);
  expect(linkElement).toBeInTheDocument();
});