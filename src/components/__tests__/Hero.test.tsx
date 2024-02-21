import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { setReadOnlyProperty } from '../../lib/test-helpers';
import Window from '../../modules/Window';
import * as hooks from '../../lib/hooks';
import * as ga from '../../lib/google-analytics';
import { GoogleAnalyticsEvents } from '../../types';
import { ABOUT_ME_ELEMENT_ID } from '../../constants';
import Hero from '../Hero';

describe('Hero component', () => {
  const renderComponent = () => render(<Hero />);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the contents', () => {
    renderComponent();

    expect(
      screen.queryByText('Dominic Arrojado · Lead Engineer')
    ).toBeInTheDocument();
  });

  it('should handle MoveTo unexpected error', async () => {
    const consoleErrorOrig = console.error;
    const consoleErrorMock = jest.fn();

    console.error = consoleErrorMock;

    const unexpectedError = 'unexpected error';

    jest.mock('moveto', () =>
      jest.fn(() => {
        throw unexpectedError;
      })
    );

    renderComponent();

    await act(async () => Window.emit('load'));

    expect(consoleErrorMock).toBeCalledTimes(1);
    expect(consoleErrorMock).toBeCalledWith(
      'Error on MoveTo import:',
      unexpectedError
    );

    console.error = consoleErrorOrig;
  });

  it('should have parallax and opacity effect on scroll below window height', async () => {
    const pageYOffsetOrig = window.pageYOffset;

    renderComponent();

    const pageYOffset = window.innerHeight - 1;

    setReadOnlyProperty(window, 'pageYOffset', pageYOffset);

    const heroDescEl = screen.queryByTestId('desc');
    const offsetTop = 375;
    const offsetHeight = 32;

    setReadOnlyProperty(heroDescEl, 'offsetTop', offsetTop);
    setReadOnlyProperty(heroDescEl, 'offsetHeight', offsetHeight);

    await act(async () => Window.emit('scroll'));

    const heroImgEl = screen.queryByTestId('img');
    const heroLogoEl = screen.queryByTestId('logo');

    expect(heroImgEl).toHaveStyle({
      transform: `translate3d(0, ${pageYOffset * 0.2}px, 0)`,
    });

    const opacity = Math.max(
      1 - window.pageYOffset / (offsetTop + offsetHeight),
      0
    );

    expect(heroLogoEl).toHaveStyle({ opacity });
    expect(heroDescEl).toHaveStyle({ opacity });

    setReadOnlyProperty(window, 'pageYOffset', pageYOffsetOrig);
  });

  it("shouldn't parallax and opacity effect on scroll above window height", async () => {
    const pageYOffsetOrig = window.pageYOffset;

    renderComponent();

    const pageYOffset = window.innerHeight + 1;

    setReadOnlyProperty(window, 'pageYOffset', pageYOffset);

    await act(async () => Window.emit('scroll'));

    const heroImgEl = screen.queryByTestId('img');
    const heroLogoEl = screen.queryByTestId('logo');
    const heroDescEl = screen.queryByTestId('desc');

    expect(heroImgEl).toHaveStyle({ transform: '' });
    expect(heroLogoEl).toHaveStyle({ opacity: '' });
    expect(heroDescEl).toHaveStyle({ opacity: '' });

    setReadOnlyProperty(window, 'pageYOffset', pageYOffsetOrig);
  });

  it('should scroll down on button click', () => {
    const moveMock = jest.fn();

    renderComponent();

    const aboutMeEl = document.createElement('div');
    aboutMeEl.id = ABOUT_ME_ELEMENT_ID;
    document.body.appendChild(aboutMeEl);

    jest
      .spyOn(hooks, 'getRefValue')
      .mockReturnValueOnce(null) // aboutMeRef
      .mockReturnValueOnce({ move: moveMock }); // moveToRef

    const scrollBtnEl = screen.queryByRole('button');

    fireEvent.click(scrollBtnEl);

    expect(moveMock).toBeCalledTimes(1);
    expect(moveMock).toBeCalledWith(aboutMeEl);
  });

  it('should scroll down on button click (aboutMeEl cached)', () => {
    const moveMock = jest.fn();

    renderComponent();

    const aboutMeEl = document.createElement('div');
    aboutMeEl.id = ABOUT_ME_ELEMENT_ID;
    document.body.appendChild(aboutMeEl);

    jest
      .spyOn(hooks, 'getRefValue')
      .mockReturnValueOnce(aboutMeEl) // aboutMeRef
      .mockReturnValueOnce({ move: moveMock }); // moveToRef

    const scrollBtnEl = screen.queryByRole('button');

    fireEvent.click(scrollBtnEl);

    expect(moveMock).toBeCalledTimes(1);
    expect(moveMock).toBeCalledWith(aboutMeEl);
  });

  it('should scroll down on button click (aboutMeEl and moveTo are null)', () => {
    renderComponent();

    jest
      .spyOn(hooks, 'getRefValue')
      .mockReturnValueOnce(null) // aboutMeRef
      .mockReturnValueOnce(null); // moveToRef

    const scrollBtnEl = screen.queryByRole('button');

    fireEvent.click(scrollBtnEl);
  });

  it('should track scroll', () => {
    const trackEventSpy = jest.spyOn(ga, 'trackEvent');

    renderComponent();

    const scrollBtnEl = screen.queryByRole('button');

    fireEvent.click(scrollBtnEl);

    expect(trackEventSpy).toBeCalledTimes(1);
    expect(trackEventSpy).toBeCalledWith({
      event: GoogleAnalyticsEvents.SCROLL_CLICK,
      linkText: 'Scroll Down',
    });
  });
});
