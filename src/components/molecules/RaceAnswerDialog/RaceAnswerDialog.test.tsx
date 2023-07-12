import React from 'react';
import { render, screen } from '@testing-library/react';
import RaceAnswerDialog from './RaceAnswerDialog';

test('renders learn react link', () => {
  render(<RaceAnswerDialog isOpen={false} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
