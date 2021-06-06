import { useRef, useState, useEffect, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import LazyLoad from 'react-lazyload';
import { getRefValue } from '../lib/hooks';
import { useDownloadGif } from '../lib/custom-hooks';
import {
  trackEvent,
  trackHover,
  trackOutboundLink,
} from '../lib/google-analytics';

import './WorkItem.css';

import Tooltip from './Tooltip';
import { ReactComponent as StarIcon } from '../assets/images/icons/star-solid.svg';

import { Work } from '../types';
import { DOWNLOAD_GIF_SPINNER_TIMEOUT } from '../constants';

export type Props = {
  work: Work & { id: string };
  shouldShowImg: boolean;
  shouldDownloadGif: boolean;
  shouldShowGif: boolean;
};

function WorkItem({
  work: { id, title, desc, urls, img, gif, starred },
  shouldShowImg,
  shouldDownloadGif,
  shouldShowGif,
}: Props) {
  const timeoutRef = useRef<number>();
  const isDownloadingGifRef = useRef(false);
  const gifImgRef = useRef<HTMLImageElement>(null);
  const windowInnerHeight = useMemo(() => window.innerHeight, []);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [isDownloadingGif, setIsDownloadingGif] = useState(false);
  const [gifData, setGifData] = useState('');
  const [progress, setProgress] = useState(0);
  const shouldMountGif = Boolean(gifData && shouldShowGif);

  const imgOnLoad = () => setIsImgLoaded(true);
  const setIsDownloadingGifTrue = () => {
    // Delay showing of spinner in case GIF loads instantly within the timeout
    timeoutRef.current = window.setTimeout(
      () => setIsDownloadingGif(true),
      DOWNLOAD_GIF_SPINNER_TIMEOUT
    );
  };
  const setIsDownloadingGifFalse = () => {
    isDownloadingGifRef.current = false;

    clearTimeout(getRefValue(timeoutRef));
    setIsDownloadingGif(false);
  };
  const downloadGifOnStart = () => setIsDownloadingGifTrue();
  const downloadGifOnProgress = (progress: number) => setProgress(progress);
  const downloadGifOnSuccess = ({
    durationMs,
    data,
  }: {
    durationMs: number;
    data: string;
  }) => {
    setGifData(data);
    setIsDownloadingGifFalse();
    trackEvent({
      action: 'gif_auto_play_start',
      category: 'gif_auto_play',
      label: `Downloaded GIF - ${title}`,
      nonInteraction: true,
      gifLoadTime: durationMs / 1000,
    });
  };
  const downloadGifOnCancel = ({
    durationMs,
    progress,
  }: {
    durationMs: number;
    progress: number;
  }) => {
    setIsDownloadingGifFalse();
    setProgress(0);
    trackEvent({
      action: 'gif_auto_play_cancel',
      category: 'gif_auto_play',
      label: `Cancel Download GIF - ${title}`,
      nonInteraction: true,
      gifCancelTime: durationMs / 1000,
      gifCancelProgress: progress,
    });
  };
  const downloadGifOnError = (err: any) =>
    console.error('Error on Work GIF download:', err);
  const { startDownloadGif, cancelDownloadGif } = useDownloadGif({
    url: gif,
    onStart: downloadGifOnStart,
    onProgress: downloadGifOnProgress,
    onSuccess: downloadGifOnSuccess,
    onCancel: downloadGifOnCancel,
    onError: downloadGifOnError,
  });
  const gifSpinnerOnMouseEnter = () => trackHover(`Downloading GIF - ${title}`);
  const starIconOnMouseEnter = () => trackHover(`Best Project - ${title}`);

  useEffect(() => {
    if (!gifData && isImgLoaded) {
      if (shouldDownloadGif) {
        startDownloadGif();
      } else {
        cancelDownloadGif();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gifData, shouldDownloadGif, isImgLoaded]);

  return (
    <li id={id} className="work-item" data-active={shouldShowGif}>
      <div className="img">
        {shouldShowImg && (
          <div className="wrapper">
            <LazyLoad offset={windowInnerHeight} once>
              <img
                src={img}
                alt={title}
                className="static"
                draggable={false}
                onLoad={imgOnLoad}
              />
            </LazyLoad>
            <CSSTransition
              in={shouldMountGif}
              nodeRef={gifImgRef}
              timeout={300}
              classNames="gif"
              mountOnEnter
              unmountOnExit
            >
              <img
                ref={gifImgRef}
                src={gifData}
                alt={`${title} GIF`}
                draggable={false}
                className="gif"
              />
            </CSSTransition>
            {isDownloadingGif && (
              <div
                onMouseEnter={gifSpinnerOnMouseEnter}
                className="spinner-container"
                data-testid="gif-spinner"
              >
                <div className="spinner" />
                <div className="text">{progress}</div>
                <Tooltip position="right">Downloading GIF...</Tooltip>
              </div>
            )}
          </div>
        )}
        {!isImgLoaded && <div className="spinner"></div>}
      </div>
      <div className="info">
        <div className="title">
          {starred && (
            <div
              onMouseEnter={starIconOnMouseEnter}
              className="icon"
              data-testid="star-icon"
            >
              <StarIcon />
              <Tooltip>Best Project</Tooltip>
            </div>
          )}
          {title}
        </div>
        <div className="desc">{desc}</div>
        <div className="btns">
          {urls.map((urlItem, index) => (
            <div key={index} className="btn">
              <a
                href={urlItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-text"
                onClick={trackOutboundLink}
                onContextMenu={trackOutboundLink}
              >
                {urlItem.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}

export default WorkItem;
