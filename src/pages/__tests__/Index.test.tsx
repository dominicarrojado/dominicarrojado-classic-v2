import React from 'react';
import { render } from '@testing-library/react';
import Index from '../Index';

describe('Index', () => {
  it('renders without errors', () => {
    const { container } = render(<Index />);

    expect(container).toBeInTheDocument();
  });
});
