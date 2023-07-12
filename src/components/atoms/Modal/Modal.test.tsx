import React from 'react';
import { render, screen } from '@testing-library/react';
import Modal from './Modal';

test('renders learn react link', () => {
  render(<Modal isOpen={false}>123</Modal>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
