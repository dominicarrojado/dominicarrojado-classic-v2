import { useRef } from 'react';
import { AxiosStatic, CancelTokenSource } from 'axios';
import { getRefValue } from './hooks';
import { getImageDataFromResponse } from './axios';

export function useDownloadGif({
  url,
  onStart,
  onProgress,
  onSuccess,
  onCancel,
  onError,
}: {
  url: string;
  onStart: () => void;
  onProgress: (progress: number) => void;
  onSuccess: (e: { durationMs: number; data: string }) => void;
  onCancel: (e: { durationMs: number; progress: number }) => void;
  onError: (err: any) => void;
}) {
  const isDownloadingRef = useRef(false);
  const axiosSourceRef = useRef<CancelTokenSource | null>(null);

  const startDownloadGif = async () => {
    if (getRefValue(isDownloadingRef)) {
      return;
    }

    isDownloadingRef.current = true;

    onStart();

    let axios: AxiosStatic | undefined;
    let downloadStartMs = 0;
    let progress = 0;

    try {
      downloadStartMs = Date.now();

      // Dynamically import Axios
      axios = (await import('axios')).default;

      axiosSourceRef.current = axios.CancelToken.source();

      const res = await axios.get(url, {
        responseType: 'arraybuffer',
        cancelToken: getRefValue(axiosSourceRef).token,
        onDownloadProgress: (e) => {
          progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        },
      });

      onSuccess({
        durationMs: Date.now() - downloadStartMs,
        data: getImageDataFromResponse(res),
      });
    } catch (err) {
      if (axios && axios.isCancel(err)) {
        onCancel({
          progress,
          durationMs: Date.now() - downloadStartMs,
        });
      } else {
        onError(err);
      }
    } finally {
      isDownloadingRef.current = false;
    }
  };
  const cancelDownloadGif = () => {
    const axiosSource = getRefValue(axiosSourceRef);

    if (axiosSource) {
      axiosSource.cancel();
      axiosSourceRef.current = null;
    }
  };

  return { startDownloadGif, cancelDownloadGif };
}
