import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import * as ga from '../../lib/google-analytics';
import * as dom from '../../lib/dom';
import { GoogleAnalyticsEvents, Social, SocialNames } from '../../types';
import FooterSocialItem from '../FooterSocialItem';

describe('FooterSocialItem component', () => {
  const renderComponent = (social: Social) =>
    render(<FooterSocialItem social={social} />);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with correct attribute', () => {
    const social = {
      name: SocialNames.LINKEDIN,
      title: 'LinkedIn',
      url: 'http://www.linkedin.com',
    };
    renderComponent(social);

    const anchorEl = screen.queryByRole('link');

    expect(anchorEl.tagName).toBe('A');
    expect(anchorEl).toHaveAttribute('href', social.url);
    expect(anchorEl).toHaveAttribute('rel', 'noopener noreferrer nofollow');
    expect(anchorEl).toHaveAttribute('target', '_blank');
  });

  it('should track hover (mouse leave)', () => {
    const trackEventSpy = jest.spyOn(ga, 'trackEvent');

    const social = {
      name: 'twitter' as any,
      title: 'Twitter',
      url: 'https://www.twitter.com',
    };
    renderComponent(social);

    const anchorEl = screen.queryByRole('link');

    fireEvent.mouseLeave(anchorEl);

    expect(trackEventSpy).toBeCalledTimes(1);
    expect(trackEventSpy).toBeCalledWith({
      event: GoogleAnalyticsEvents.SOCIAL_HOVER,
      socialName: social.name,
      hoverText: social.title,
      hoverUrl: social.url,
    });
  });

  it("shouldn't track hover if already clicked", () => {
    const trackEventSpy = jest.spyOn(ga, 'trackEvent');

    const social = {
      name: 'twitter' as any,
      title: 'Twitter',
      url: 'https://www.twitter.com',
    };
    renderComponent(social);

    const anchorEl = screen.queryByRole('link');

    fireEvent.click(anchorEl);
    fireEvent.mouseLeave(anchorEl);

    expect(trackEventSpy).not.toBeCalledWith({
      event: GoogleAnalyticsEvents.SOCIAL_HOVER,
      socialName: social.name,
      hoverText: social.title,
      hoverUrl: social.url,
    });
  });

  it('should track click', () => {
    const trackEventSpy = jest.spyOn(ga, 'trackEvent');

    const social = {
      name: 'facebook' as any,
      title: 'Facebook',
      url: 'https://www.facebook.com',
    };
    renderComponent(social);

    const anchorEl = screen.queryByRole('link');

    fireEvent.click(anchorEl);

    expect(trackEventSpy).toBeCalledTimes(1);
    expect(trackEventSpy).toBeCalledWith({
      event: GoogleAnalyticsEvents.SOCIAL_CLICK,
      socialName: social.name,
      linkText: social.title,
      linkUrl: social.url,
    });
  });

  it('should copy email if API is available', () => {
    const copyTextToClipboardSpy = jest
      .spyOn(dom, 'copyTextToClipboard')
      .mockReturnValue(true);

    const email = 'name@example.com';
    const social = {
      name: SocialNames.EMAIL,
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
      name: SocialNames.EMAIL,
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
      name: SocialNames.EMAIL,
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
