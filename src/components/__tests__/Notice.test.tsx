import React from 'react';
import { render, screen } from '@testing-library/react';
import { queryByTextIgnoreHTML } from '../../lib/test-helpers';
import * as customHooks from '../../lib/custom-hooks';
import { MAIN_URL } from '../../constants';
import Notice from '../Notice';

describe('Notice component', () => {
  const renderComponent = () => render(<Notice />);

  describe('content', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('should have expected content', () => {
      const contentEl = queryByTextIgnoreHTML(
        screen,
        'You are currently viewing an outdated version of the main website. To view the updated version, click here.'
      );

      expect(contentEl).toBeInTheDocument();
    });

    it('should have expected anchor', () => {
      const anchorEl = screen.queryByText('here');

      expect(anchorEl.tagName).toBe('A');
      expect(anchorEl).toHaveAttribute('href', MAIN_URL);
      expect(anchorEl).not.toHaveAttribute('target');
      expect(anchorEl).not.toHaveAttribute('rel');
    });
  });

  describe('display logic', () => {
    it('should be hidden if window is not loaded', () => {
      jest.spyOn(customHooks, 'useWindowLoaded').mockReturnValue(false);

      const component = renderComponent();
      const noticeEl = component.container.firstChild;

      expect(noticeEl).not.toHaveClass('show');
    });

    it('should be displayed on window load', () => {
      jest.spyOn(customHooks, 'useWindowLoaded').mockReturnValue(true);

      const component = renderComponent();
      const noticeEl = component.container.firstChild;

      expect(noticeEl).toHaveClass('show');
    });
  });
});
