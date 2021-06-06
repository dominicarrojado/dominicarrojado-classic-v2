import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { forceVisible } from 'react-lazyload';
import { config } from 'react-transition-group';
import * as ga from '../../lib/google-analytics';
import * as customHooks from '../../lib/custom-hooks';
import WorkItem, { Props as WorkItemProps } from '../WorkItem';

config.disabled = true; // Disable react-transitions-group transitions

describe('WorkItem component', () => {
  const workData = {
    id: 'work-0',
    title: 'Some Project',
    desc: 'A quick brown fox jumps over the lazy dog.',
    urls: [
      {
        title: 'First Page',
        url: 'https://www.example.com/1',
      },
      {
        title: 'Second Page',
        url: 'https://www.example.com/2',
      },
    ],
    img: '/works/some-project.png',
    gif: '/works/some-project.gif',
  };
  const renderComponent = (props: Partial<WorkItemProps> = {}) =>
    render(
      <WorkItem
        work={workData}
        shouldShowImg={false}
        shouldDownloadGif={false}
        shouldShowGif={false}
        {...props}
      />
    );

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the contents', () => {
    renderComponent();

    expect(screen.getByText(workData.title)).toBeInTheDocument();
    expect(screen.getByText(workData.desc)).toBeInTheDocument();

    workData.urls.forEach((urlItem) => {
      expect(screen.getByText(urlItem.title)).toBeInTheDocument();
    });
  });

  it('renders the urls', () => {
    renderComponent();

    workData.urls.forEach((urlItem) => {
      const anchorEl = screen.getByText(urlItem.title);

      expect(anchorEl.tagName).toBe('A');
      expect(anchorEl).toHaveAttribute('href', urlItem.url);
      expect(anchorEl).toHaveAttribute('target', '_blank');
      expect(anchorEl).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should track url click', () => {
    const trackOutboundLinkSpy = jest.spyOn(ga, 'trackOutboundLink');

    renderComponent();

    workData.urls.forEach((urlItem) => {
      const anchorEl = screen.getByText(urlItem.title);

      fireEvent.click(anchorEl);

      expect(trackOutboundLinkSpy).toBeCalledTimes(1);
      expect(trackOutboundLinkSpy).toBeCalledWith(expect.any(Object));

      trackOutboundLinkSpy.mockClear();
    });
  });

  it('should track url context menu', () => {
    const trackOutboundLinkSpy = jest.spyOn(ga, 'trackOutboundLink');

    renderComponent();

    workData.urls.forEach((urlItem) => {
      const anchorEl = screen.getByText(urlItem.title);

      fireEvent.contextMenu(anchorEl);

      expect(trackOutboundLinkSpy).toBeCalledTimes(1);
      expect(trackOutboundLinkSpy).toBeCalledWith(expect.any(Object));

      trackOutboundLinkSpy.mockClear();
    });
  });

  it("shouldn't have a star icon if not starred", () => {
    renderComponent({ work: { ...workData, starred: false } });

    expect(screen.queryByTestId('star-icon')).not.toBeInTheDocument();
  });

  it('should have a star icon if starred', () => {
    renderComponent({ work: { ...workData, starred: true } });

    expect(screen.queryByTestId('star-icon')).toBeInTheDocument();
  });

  it('should render tooltip if star icon is hovered', () => {
    renderComponent({ work: { ...workData, starred: true } });

    const starIconEl = screen.queryByTestId('star-icon');
    const tooltipEl = starIconEl.querySelector('[role=tooltip]');

    fireEvent.mouseEnter(tooltipEl);

    expect(screen.queryByText('Best Project')).toBeInTheDocument();
  });

  it('should track star icon hover', () => {
    const trackHoverSpy = jest.spyOn(ga, 'trackHover');

    renderComponent({ work: { ...workData, starred: true } });

    const tooltipEl = screen.getByRole('tooltip');

    fireEvent.mouseEnter(tooltipEl);

    expect(trackHoverSpy).toBeCalledTimes(1);
    expect(trackHoverSpy).toBeCalledWith(`Best Project - ${workData.title}`);
  });

  it('should render image', () => {
    renderComponent({ shouldShowImg: true });

    forceVisible();

    const imgEl = screen.queryByAltText(workData.title);

    expect(imgEl).toHaveAttribute('src', workData.img);
  });

  it("shouldn't render GIF spinner if not downloading GIF", () => {
    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: false,
    });

    expect(screen.queryByTestId('gif-spinner')).not.toBeInTheDocument();
  });

  it('should render GIF spinner if downloading GIF', async () => {
    jest.useFakeTimers();

    const progress = 77;
    let onStartFunc: () => void;
    let onProgressFunc: () => void;

    jest
      .spyOn(customHooks, 'useDownloadGif')
      .mockImplementation(({ onStart, onProgress }) => {
        onStartFunc = onStart;
        onProgressFunc = () => onProgress(progress);
        return { startDownloadGif: jest.fn(), cancelDownloadGif: jest.fn() };
      });

    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: true,
    });

    act(() => {
      onStartFunc();
      onProgressFunc();
      jest.runAllTimers();
    });

    await waitFor(() => screen.queryByTestId('gif-spinner'));

    expect(screen.queryByTestId('gif-spinner')).toBeInTheDocument();
    expect(screen.queryByText(`${progress}`)).toBeInTheDocument();
  });

  it('should render tooltip if GIF spinner is hovered', async () => {
    jest.useFakeTimers();

    let onStartFunc: () => void;

    jest
      .spyOn(customHooks, 'useDownloadGif')
      .mockImplementation(({ onStart }) => {
        onStartFunc = onStart;
        return { startDownloadGif: jest.fn(), cancelDownloadGif: jest.fn() };
      });

    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: true,
    });

    act(() => {
      onStartFunc();
      jest.runAllTimers();
    });

    await waitFor(() => screen.queryByTestId('gif-spinner'));

    const gifSpinnerEl = screen.queryByTestId('gif-spinner');
    const tooltipEl = gifSpinnerEl.querySelector('[role=tooltip]');

    fireEvent.mouseEnter(tooltipEl);

    expect(screen.queryByText('Downloading GIF...')).toBeInTheDocument();
  });

  it('should track GIF spinner hover', async () => {
    jest.useFakeTimers();

    const trackHoverSpy = jest.spyOn(ga, 'trackHover');

    let onStartFunc: () => void;

    jest
      .spyOn(customHooks, 'useDownloadGif')
      .mockImplementation(({ onStart }) => {
        onStartFunc = onStart;
        return { startDownloadGif: jest.fn(), cancelDownloadGif: jest.fn() };
      });

    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: true,
    });

    act(() => {
      onStartFunc();
      jest.runAllTimers();
    });

    await waitFor(() => screen.queryByTestId('gif-spinner'));

    const gifSpinnerEl = screen.queryByTestId('gif-spinner');
    const tooltipEl = gifSpinnerEl.querySelector('[role=tooltip]');

    fireEvent.mouseEnter(tooltipEl);

    expect(trackHoverSpy).toBeCalledTimes(1);
    expect(trackHoverSpy).toBeCalledWith(`Downloading GIF - ${workData.title}`);
  });

  it('should download GIF on image load', () => {
    jest.useFakeTimers();

    const startDownloadGifMock = jest.fn();
    const cancelDownloadGifMock = jest.fn();

    jest.spyOn(customHooks, 'useDownloadGif').mockReturnValue({
      startDownloadGif: startDownloadGifMock,
      cancelDownloadGif: cancelDownloadGifMock,
    });

    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: true,
    });

    forceVisible();

    const imgEl = screen.queryByRole('img');

    imgEl.dispatchEvent(new Event('load'));

    jest.runAllTimers();

    expect(startDownloadGifMock).toBeCalledTimes(1);
    expect(cancelDownloadGifMock).not.toBeCalled();
  });

  it('should cancel download GIF', () => {
    jest.useFakeTimers();

    const startDownloadGifMock = jest.fn();
    const cancelDownloadGifMock = jest.fn();

    jest.spyOn(customHooks, 'useDownloadGif').mockReturnValue({
      startDownloadGif: startDownloadGifMock,
      cancelDownloadGif: cancelDownloadGifMock,
    });

    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: false,
    });

    forceVisible();

    const imgEl = screen.queryByRole('img');

    imgEl.dispatchEvent(new Event('load'));

    jest.runAllTimers();

    expect(cancelDownloadGifMock).toBeCalledTimes(1);
    expect(startDownloadGifMock).not.toBeCalled();
  });

  it('should hide GIF spinner on download cancel', async () => {
    jest.useFakeTimers();

    let onStartFunc: () => void;
    let onCancelFunc: () => void;

    jest
      .spyOn(customHooks, 'useDownloadGif')
      .mockImplementation(({ onStart, onCancel }) => {
        onStartFunc = onStart;
        onCancelFunc = () => onCancel({ durationMs: 0, progress: 0 });
        return {
          startDownloadGif: jest.fn(),
          cancelDownloadGif: jest.fn(),
        };
      });

    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: true,
    });

    act(() => {
      onStartFunc();
      jest.runAllTimers();
    });

    await waitFor(() => screen.queryByTestId('gif-spinner'));

    expect(screen.queryByTestId('gif-spinner')).toBeInTheDocument();

    act(() => onCancelFunc());

    expect(screen.queryByTestId('gif-spinner')).not.toBeInTheDocument();
  });

  it('should track GIF download cancel', async () => {
    const trackEventSpy = jest.spyOn(ga, 'trackEvent');
    const durationMs = 6000;
    const progress = 75;
    let onCancelFunc: () => void;

    jest
      .spyOn(customHooks, 'useDownloadGif')
      .mockImplementation(({ onCancel }) => {
        onCancelFunc = () => onCancel({ durationMs, progress });
        return {
          startDownloadGif: jest.fn(),
          cancelDownloadGif: jest.fn(),
        };
      });

    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: true,
    });

    act(() => {
      onCancelFunc();
    });

    expect(trackEventSpy).toBeCalledTimes(1);
    expect(trackEventSpy).toBeCalledWith({
      action: 'gif_auto_play_cancel',
      category: 'gif_auto_play',
      label: `Cancel Download GIF - ${workData.title}`,
      nonInteraction: true,
      gifCancelTime: durationMs / 1000,
      gifCancelProgress: progress,
    });
  });

  it('should render GIF on download success', () => {
    const gifData = 'data:image/gif;base64';
    let onSuccessFunc: () => void;

    jest
      .spyOn(customHooks, 'useDownloadGif')
      .mockImplementation(({ onSuccess }) => {
        onSuccessFunc = () => onSuccess({ data: gifData, durationMs: 0 });
        return {
          startDownloadGif: jest.fn(),
          cancelDownloadGif: jest.fn(),
        };
      });

    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: true,
      shouldShowGif: true,
    });

    act(() => {
      onSuccessFunc();
    });

    const gifEl = screen.queryByAltText(`${workData.title} GIF`);

    expect(gifEl).toHaveAttribute('src', gifData);
  });

  it('should track GIF download success', () => {
    const trackEventSpy = jest.spyOn(ga, 'trackEvent');
    const durationMs = 3000;
    let onSuccessFunc: () => void;

    jest
      .spyOn(customHooks, 'useDownloadGif')
      .mockImplementation(({ onSuccess }) => {
        onSuccessFunc = () =>
          onSuccess({ durationMs, data: 'data:image/gif;base64' });
        return {
          startDownloadGif: jest.fn(),
          cancelDownloadGif: jest.fn(),
        };
      });

    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: true,
      shouldShowGif: true,
    });

    act(() => {
      onSuccessFunc();
    });

    expect(trackEventSpy).toBeCalledTimes(1);
    expect(trackEventSpy).toBeCalledWith({
      action: 'gif_auto_play_start',
      category: 'gif_auto_play',
      label: `Downloaded GIF - ${workData.title}`,
      nonInteraction: true,
      gifLoadTime: durationMs / 1000,
    });
  });

  it('should log on download error', () => {
    const consoleErrorOrig = console.error;
    const consoleErrorMock = jest.fn();

    console.error = consoleErrorMock;

    const unexpectedError = 'unexpected error';
    let onErrorFunc: () => void;

    jest
      .spyOn(customHooks, 'useDownloadGif')
      .mockImplementation(({ onError }) => {
        onErrorFunc = () => onError(unexpectedError);
        return {
          startDownloadGif: jest.fn(),
          cancelDownloadGif: jest.fn(),
        };
      });

    renderComponent({
      shouldShowImg: true,
      shouldDownloadGif: true,
      shouldShowGif: true,
    });

    onErrorFunc();

    expect(consoleErrorMock).toBeCalledTimes(1);
    expect(consoleErrorMock).toBeCalledWith(
      'Error on Work GIF download:',
      unexpectedError
    );

    console.error = consoleErrorOrig;
  });
});
