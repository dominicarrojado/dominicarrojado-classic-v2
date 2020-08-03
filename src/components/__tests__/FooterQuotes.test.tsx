import React from 'react';
import { render } from '@testing-library/react';
import FooterQuotes from '../FooterQuotes';
import { FAVORITE_QUOTES } from '../../constants';

describe('FooterQuotes', () => {
  it('renders all quotes', () => {
    const { getByText } = render(<FooterQuotes />);

    FAVORITE_QUOTES.forEach((item) => {
      expect(getByText(new RegExp(item.quote, 'i'))).toBeInTheDocument();
    });
  });
});
