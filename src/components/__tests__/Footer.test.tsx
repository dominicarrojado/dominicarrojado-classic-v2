import React from 'react';
import { render } from '@testing-library/react';
import Footer from '../Footer';
import { SOCIAL_LINKS } from '../../constants';

describe('Footer', () => {
  it('renders all social', () => {
    const { getByTestId } = render(<Footer />);

    SOCIAL_LINKS.forEach((item) => {
      expect(getByTestId(item.name)).toBeInTheDocument();
    });
  });
});
