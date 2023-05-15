import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './Input';

test('renders learn react link', () => {
  render(<Input onChangeValue={() => {}}/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
