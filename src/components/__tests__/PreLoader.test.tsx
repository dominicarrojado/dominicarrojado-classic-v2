import React from 'react';
import { render } from '@testing-library/react';
import PreLoader from '../PreLoader';

describe('PreLoader component', () => {
  it('renders without errors', () => {
    const { container } = render(<PreLoader />);

    expect(container).toBeInTheDocument();
  });
});
