import React from 'react';
import { render } from '@testing-library/react';
import Works from '../Works';
import { WORKS } from '../../constants';

describe('Works', () => {
  it('renders all works', () => {
    const { getByTestId } = render(<Works />);

    WORKS.forEach((item, index) => {
      expect(getByTestId(`work-${index}`)).toBeInTheDocument();
    });
  });
});
