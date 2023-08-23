import React from 'react';
import { render, screen } from '@testing-library/react';
import Paint from './Paint';

test('renders learn react link', () => {
  render(<Paint id="test" cardList={[]}/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
