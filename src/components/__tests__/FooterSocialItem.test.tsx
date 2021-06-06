import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import * as ga from '../../lib/google-analytics';
import * as dom from '../../lib/dom';
import { Social } from '../../types';
import FooterSocialItem from '../FooterSocialItem';

describe('FooterSocialItem component', () => {
  const renderComponent = (social: Social) =>
    render(<FooterSocialItem social={social} />);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with correct attribute', () => {
    const social = {
      name: 'twitter',
      title: 'Twitter',
      url: 'http://www.twitter.com',
    };
    renderComponent(social);

    const anchorEl = screen.queryByRole('link');

    expect(anchorEl.tagName).toBe('A');
    expect(anchorEl).toHaveAttribute('href', social.url);
    expect(anchorEl).toHaveAttribute('rel', 'noopener noreferrer nofollow');
    expect(anchorEl).toHaveAttribute('target', '_blank');
  });

  it('should track hover', () => {
    const trackHoverSpy = jest.spyOn(ga, 'trackHover');

    const social = {
      name: 'linkedin',
      title: 'LinkedIn',
      url: 'https://www.linkedin.com',
    };
    renderComponent(social);

    const anchorEl = screen.queryByRole('link');

    fireEvent.mouseEnter(anchorEl);

    expect(trackHoverSpy).toBeCalledTimes(1);
    expect(trackHoverSpy).toBeCalledWith(social.title);
  });

  it('should track click', () => {
    const trackOutboundLinkSpy = jest.spyOn(ga, 'trackOutboundLink');

    const social = {
      name: 'github',
      title: 'GitHub',
      url: 'https://www.github.com',
    };
    renderComponent(social);

    const anchorEl = screen.queryByRole('link');

    fireEvent.click(anchorEl);

    expect(trackOutboundLinkSpy).toBeCalledTimes(1);
    expect(trackOutboundLinkSpy).toBeCalledWith(expect.any(Object));
  });

  it('should copy email if API is available', () => {
    const copyTextToClipboardSpy = jest
      .spyOn(dom, 'copyTextToClipboard')
      .mockReturnValue(true);

    const email = 'name@example.com';
    const social = {
      name: 'email',
      title: 'Email',
      url: `mailto:${email}`,
    };
    renderComponent(social);

    const anchorEl = screen.queryByRole('link');

    fireEvent.click(anchorEl);

    expect(copyTextToClipboardSpy).toBeCalledTimes(1);
    expect(copyTextToClipboardSpy).toBeCalledWith(email);
    expect(screen.queryByText('Copied!')).toBeInTheDocument();
  });

  it("shouldn't copy email if API is not available", () => {
    jest.spyOn(dom, 'copyTextToClipboard').mockReturnValue(false);

    const email = 'name@example.com';
    const social = {
      name: 'email',
      title: 'Email',
      url: `mailto:${email}`,
    };
    renderComponent(social);

    const anchorEl = screen.queryByRole('link');

    fireEvent.click(anchorEl);

    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
  });

  it('should hide copy tooltip on mouse leave', () => {
    jest.useFakeTimers();
    jest.spyOn(dom, 'copyTextToClipboard').mockReturnValue(true);

    const email = 'root@example.com';
    const social = {
      name: 'email',
      title: 'Email',
      url: `mailto:${email}`,
    };
    renderComponent(social);

    const anchorEl = screen.queryByRole('link');

    fireEvent.click(anchorEl);
    fireEvent.mouseLeave(anchorEl);

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
  });
});
