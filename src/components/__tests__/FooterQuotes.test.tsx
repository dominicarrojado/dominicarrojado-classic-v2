import React from 'react';
import { act, render, screen } from '@testing-library/react';
import * as hooks from '../../lib/hooks';
import { FAVORITE_QUOTES, FOOTER_QUOTES_INTERVAL } from '../../constants';
import FooterQuotes from '../FooterQuotes';

describe('FooterQuotes component', () => {
  const renderComponent = () => render(<FooterQuotes />);

  it('renders all quotes', () => {
    renderComponent();

    FAVORITE_QUOTES.forEach((item) => {
      expect(
        screen.queryByText(new RegExp(item.quote, 'i'))
      ).toBeInTheDocument();
    });
  });

  it('renders without errors if ref.current is null', () => {
    jest.spyOn(hooks, 'getRefValue').mockReturnValue(null);

    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
  });

  it('should show the first quote by default', () => {
    renderComponent();

    const firstQuoteEl = screen.queryAllByRole('listitem')[0];

    expect(firstQuoteEl).toHaveClass('show');
  });

  it('should show the second quote after interval', () => {
    jest.useFakeTimers();

    renderComponent();

    act(() => {
      jest.advanceTimersByTime(FOOTER_QUOTES_INTERVAL);
    });

    const secondQuoteEl = screen.queryAllByRole('listitem')[1];

    expect(secondQuoteEl).toHaveClass('show');
  });

  it('should show the first quote again after the last quote', () => {
    jest.useFakeTimers();

    renderComponent();

    act(() => {
      jest.advanceTimersByTime(FOOTER_QUOTES_INTERVAL * FAVORITE_QUOTES.length);
    });

    const firstQuoteEl = screen.queryAllByRole('listitem')[0];

    expect(firstQuoteEl).toHaveClass('show');
  });
});
