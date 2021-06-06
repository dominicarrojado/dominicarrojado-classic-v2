import React from 'react';
import { render, screen } from '@testing-library/react';
import * as FooterQuotes from '../FooterQuotes';
import * as FooterSocialItem from '../FooterSocialItem';
import { SOCIAL_LINKS } from '../../constants';
import Footer from '../Footer';

describe('Footer component', () => {
  const renderComponent = () => render(<Footer />);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the contents', () => {
    renderComponent();

    const currentYear = new Date().getFullYear();

    expect(
      screen.queryByText(`© Dominic Arrojado ${currentYear}`)
    ).toBeInTheDocument();
  });

  it('renders the components', () => {
    const footerQuotesSpy = jest.spyOn(FooterQuotes, 'default');
    const footerSocialItemSpy = jest.spyOn(FooterSocialItem, 'default');

    renderComponent();

    expect(footerSocialItemSpy).toBeCalledTimes(SOCIAL_LINKS.length);

    SOCIAL_LINKS.forEach((item, idx) => {
      expect(footerSocialItemSpy).toHaveBeenNthCalledWith(
        idx + 1,
        { social: item },
        {}
      );
    });

    expect(footerQuotesSpy).toBeCalledTimes(1);
  });
});
