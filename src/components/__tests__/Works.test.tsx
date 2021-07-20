import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { setReadOnlyProperty } from '../../lib/test-helpers';
import Window from '../../modules/Window';
import * as WorkItem from '../WorkItem';
import { WORKS } from '../../constants';
import Works from '../Works';

describe('Works component', () => {
  const resetWindowStates = () => {
    Window.loaded = false;
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    resetWindowStates();
  });

  const renderComponent = () => render(<Works />);

  it('renders the contents', () => {
    renderComponent();

    expect(screen.queryByText('Featured Projects')).toBeInTheDocument();
    expect(
      screen.queryByText("A bunch of things I've done so far.")
    ).toBeInTheDocument();
  });

  it('renders the components', () => {
    const workItemSpy = jest.spyOn(WorkItem, 'default');

    renderComponent();

    expect(workItemSpy).toBeCalledTimes(WORKS.length);

    WORKS.forEach((item, idx) => {
      expect(workItemSpy).toHaveBeenNthCalledWith(
        idx + 1,
        {
          work: {
            id: `work-${idx}`,
            ...item,
          },
          shouldShowImg: false,
          shouldDownloadGif: false,
          shouldShowGif: false,
        },
        {}
      );
    });
  });

  it("shouldn't set work id by default", () => {
    renderComponent();

    Window.loaded = true;

    const listEl = screen.queryByRole('list');

    expect(listEl.querySelectorAll('[data-active="true"]')).toHaveLength(0);
  });

  it('should set work id on scroll if within view', () => {
    jest.useFakeTimers();

    Window.loaded = true;

    renderComponent();

    act(() => {
      Window.emit('scroll');
      jest.runAllTimers();
    });

    const listEl = screen.queryByRole('list');

    expect(listEl.querySelectorAll('[data-active="true"]')).toHaveLength(1);
  });

  it("shouldn't set work id on scroll if not within view", () => {
    jest.useFakeTimers();

    Window.loaded = true;

    renderComponent();

    setReadOnlyProperty(window, 'pageYOffset', -1);
    setReadOnlyProperty(window, 'innerHeight', -1);

    act(() => {
      Window.emit('scroll');
      jest.runAllTimers();
    });

    const listEl = screen.queryByRole('list');

    expect(listEl.querySelectorAll('[data-active="true"]')).toHaveLength(0);
  });
});
