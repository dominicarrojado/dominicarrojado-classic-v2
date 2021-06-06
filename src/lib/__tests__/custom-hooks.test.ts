import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { setReadOnlyProperty } from '../test-helpers';
import * as axiosHelpers from '../axios';
import * as hooks from '../hooks';
import { useDownloadGif } from '../custom-hooks';

describe('custom hooks utils', () => {
  describe('useDownloadGif()', () => {
    const axiosCancelTokenOrig = axios.CancelToken;

    beforeEach(() => {
      jest.spyOn(axios, 'get').mockImplementation();
      jest.spyOn(axios, 'isCancel').mockImplementation();
      setReadOnlyProperty(axios, 'CancelToken', {
        source: () => ({ token: null }),
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      setReadOnlyProperty(axios, 'CancelToken', axiosCancelTokenOrig);
    });

    it('should return expected the functions', () => {
      const hook = renderHook(() =>
        useDownloadGif({
          url: 'test.gif',
          onStart: jest.fn(),
          onProgress: jest.fn(),
          onSuccess: jest.fn(),
          onCancel: jest.fn(),
          onError: jest.fn(),
        })
      );
      const { startDownloadGif, cancelDownloadGif } = hook.result.current;

      expect(typeof startDownloadGif).toBe('function');
      expect(typeof cancelDownloadGif).toBe('function');
    });

    it('should call onStart function', () => {
      const onStartMock = jest.fn();
      const hook = renderHook(() =>
        useDownloadGif({
          url: 'test.gif',
          onStart: onStartMock,
          onProgress: jest.fn(),
          onSuccess: jest.fn(),
          onCancel: jest.fn(),
          onError: jest.fn(),
        })
      );
      const { startDownloadGif } = hook.result.current;

      expect(onStartMock).toBeCalledTimes(0);

      startDownloadGif();

      expect(onStartMock).toBeCalledTimes(1);
    });

    it("shouldn't call onStart twice", () => {
      const onStartMock = jest.fn();
      const hook = renderHook(() =>
        useDownloadGif({
          url: 'test.gif',
          onStart: onStartMock,
          onProgress: jest.fn(),
          onSuccess: jest.fn(),
          onCancel: jest.fn(),
          onError: jest.fn(),
        })
      );
      const { startDownloadGif } = hook.result.current;

      startDownloadGif();
      startDownloadGif();

      expect(onStartMock).toBeCalledTimes(1);
    });

    it('should call onProgress', async () => {
      const progressEvent = { loaded: 33, total: 100 };

      jest
        .spyOn(axios, 'get')
        .mockImplementation((_url, { onDownloadProgress }) => {
          onDownloadProgress(progressEvent);
          return null;
        });

      const onProgressMock = jest.fn();
      const hook = renderHook(() =>
        useDownloadGif({
          url: 'test.gif',
          onStart: jest.fn(),
          onProgress: onProgressMock,
          onSuccess: jest.fn(),
          onCancel: jest.fn(),
          onError: jest.fn(),
        })
      );
      const { startDownloadGif } = hook.result.current;

      await startDownloadGif();

      expect(onProgressMock).toBeCalledTimes(1);
      expect(onProgressMock).toBeCalledWith(
        Math.round((progressEvent.loaded / progressEvent.total) * 100)
      );
    });

    it('should call onSuccess', async () => {
      const gifData = 'data:image/gif;base64';

      jest
        .spyOn(axiosHelpers, 'getImageDataFromResponse')
        .mockImplementation(() => gifData);

      const onSuccessMock = jest.fn();
      const hook = renderHook(() =>
        useDownloadGif({
          url: 'test.gif',
          onStart: jest.fn(),
          onProgress: jest.fn(),
          onSuccess: onSuccessMock,
          onCancel: jest.fn(),
          onError: jest.fn(),
        })
      );
      const { startDownloadGif } = hook.result.current;

      await startDownloadGif();

      expect(onSuccessMock).toBeCalledTimes(1);
      expect(onSuccessMock).toBeCalledWith({
        data: gifData,
        durationMs: expect.any(Number),
      });
    });

    it('should call onCancel', async () => {
      const progressEvent = { loaded: 33, total: 100 };

      jest
        .spyOn(axios, 'get')
        .mockImplementation((_url, { onDownloadProgress }) => {
          onDownloadProgress(progressEvent);
          throw 'unexpected error';
        });

      jest.spyOn(axios, 'isCancel').mockReturnValue(true);

      const onCancelMock = jest.fn();
      const hook = renderHook(() =>
        useDownloadGif({
          url: 'test.gif',
          onStart: jest.fn(),
          onProgress: jest.fn(),
          onSuccess: jest.fn(),
          onCancel: onCancelMock,
          onError: jest.fn(),
        })
      );

      const { startDownloadGif } = hook.result.current;

      await startDownloadGif();

      expect(onCancelMock).toBeCalledTimes(1);
      expect(onCancelMock).toBeCalledWith({
        progress: Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        ),
        durationMs: expect.any(Number),
      });
    });

    it('should call onError', async () => {
      const unexpectedError = 'unexpected error';

      jest.spyOn(axios, 'get').mockRejectedValue(unexpectedError);

      const onErrorMock = jest.fn();
      const hook = renderHook(() =>
        useDownloadGif({
          url: 'test.gif',
          onStart: jest.fn(),
          onProgress: jest.fn(),
          onSuccess: jest.fn(),
          onCancel: jest.fn(),
          onError: onErrorMock,
        })
      );

      const { startDownloadGif } = hook.result.current;

      await startDownloadGif();

      expect(onErrorMock).toBeCalledTimes(1);
      expect(onErrorMock).toBeCalledWith(unexpectedError);
    });

    it('should cancel request', () => {
      const cancelMock = jest.fn();
      jest
        .spyOn(hooks, 'getRefValue')
        .mockImplementation(() => ({ cancel: cancelMock }));

      const hook = renderHook(() =>
        useDownloadGif({
          url: 'test.gif',
          onStart: jest.fn(),
          onProgress: jest.fn(),
          onSuccess: jest.fn(),
          onCancel: jest.fn(),
          onError: jest.fn(),
        })
      );
      const { cancelDownloadGif } = hook.result.current;

      cancelDownloadGif();

      expect(cancelMock).toBeCalledTimes(1);
    });

    it("shouldn't cancel twice", () => {
      jest.spyOn(hooks, 'getRefValue').mockImplementation(() => null);

      const hook = renderHook(() =>
        useDownloadGif({
          url: 'test.gif',
          onStart: jest.fn(),
          onProgress: jest.fn(),
          onSuccess: jest.fn(),
          onCancel: jest.fn(),
          onError: jest.fn(),
        })
      );
      const { cancelDownloadGif } = hook.result.current;

      expect(() => {
        cancelDownloadGif();
      }).not.toThrow();
    });
  });
});
