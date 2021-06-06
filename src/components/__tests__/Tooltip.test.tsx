import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { config } from 'react-transition-group';
import Tooltip, { Props as TooltipProps } from '../Tooltip';

config.disabled = true; // Disable react-transitions-group transitions

describe('Tooltip component', () => {
  const children = "I'm a tooltip";
  const renderComponent = (props: Omit<TooltipProps, 'children'> = {}) => {
    render(<Tooltip {...props}>{children}</Tooltip>);
  };

  it("shouldn't render its children by default", () => {
    renderComponent();

    expect(screen.queryByText(children)).not.toBeInTheDocument();
  });

  it('should render its children if isMounted is true', () => {
    renderComponent({ isMounted: true });

    expect(screen.queryByText(children)).toBeInTheDocument();
  });

  it('should render its children on mouse enter', () => {
    renderComponent();

    fireEvent.mouseEnter(screen.getByRole('tooltip'));

    expect(screen.queryByText(children)).toBeInTheDocument();
  });

  it('should render its children on mouse enter (position left)', () => {
    renderComponent({ position: 'left' });

    fireEvent.mouseEnter(screen.getByRole('tooltip'));

    expect(screen.queryByText(children)).toBeInTheDocument();
  });

  it('should hide its children on mouse leave', () => {
    renderComponent();

    const tooltipEl = screen.getByRole('tooltip');

    fireEvent.mouseEnter(tooltipEl);
    fireEvent.mouseLeave(tooltipEl);

    expect(screen.queryByText(children)).not.toBeInTheDocument();
  });

  it('should have style "whiteSpace: normal" if text exceeds max width', () => {
    renderComponent({ maxWidth: -1 });

    fireEvent.mouseEnter(screen.getByRole('tooltip'));

    expect(screen.queryByTestId('main')).toHaveStyle({ whiteSpace: 'normal' });
  });
});
