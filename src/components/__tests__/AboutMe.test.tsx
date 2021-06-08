import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutMe from '../AboutMe';

describe('AboutMe component', () => {
  const renderComponent = () => render(<AboutMe />);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the contents', () => {
    renderComponent();

    expect(screen.queryByText('About Me')).toBeInTheDocument();
    expect(screen.queryByTestId('desc').textContent).toBe(
      "I'm Dominic Arrojado and my passion is turning design into code. I'm a web developer specializing in both front-end & back-end development. I'm experienced in developing small to large web applications. I'm currently based in Singapore and working at PropertyGuru as a Senior Software Engineer (FinTech)."
    );
  });

  it('renders the work url with correct attributes', () => {
    renderComponent();

    const anchorEl = screen.queryByText('PropertyGuru');

    expect(anchorEl.tagName).toBe('A');
    expect(anchorEl).toHaveAttribute(
      'href',
      'https://www.propertyguru.com.sg/mortgage'
    );
    expect(anchorEl).toHaveAttribute('target', '_blank');
    expect(anchorEl).toHaveAttribute('rel', 'noopener noreferrer nofollow');
  });
});
