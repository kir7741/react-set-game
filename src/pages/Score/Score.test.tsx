import React from 'react';
import { render, screen } from '@testing-library/react';
import Score from './Score';

test('renders learn react link', () => {
  render(<Score />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
