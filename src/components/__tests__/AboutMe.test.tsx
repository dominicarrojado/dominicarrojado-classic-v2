import React from 'react';
import { render } from '@testing-library/react';
import AboutMe from '../AboutMe';

describe('AboutMe', () => {
  it('renders without errors', () => {
    const { container } = render(<AboutMe />);

    expect(container).toBeInTheDocument();
  });
});
