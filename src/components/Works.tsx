import React, { useRef, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import LazyLoad from 'react-lazyload';
import { CancelTokenSource } from 'axios';

import Window from '../modules/Window';
import { getImageDataFromResponse } from '../lib/axios';
import {
  trackEvent,
  trackHover,
  trackOutboundLink,
} from '../lib/google-analytics';

import './Works.css';

import { ReactComponent as StarIcon } from '../assets/images/icons/star-solid.svg';

import Tooltip from './Tooltip';

import {
  WORKS,
  DOWNLOAD_GIF_SPINNER_TIMEOUT,
  SET_WORK_IN_VIEW_TIMEOUT,
} from '../constants';

type Timeouts = {
  [key: string]: number;
};

type ImageLoaded = {
  [key: string]: boolean;
};

type GifData = {
  [key: string]: string;
};

type WorkInView = {
  id: string;
  title: string;
  gif: string;
};

function Works() {
  const timeouts = useRef<Timeouts>({});
  const axiosSource = useRef<CancelTokenSource | null>(null);
  const downloadingGIF = useRef<string | null>(null);
  const worksEl = useRef<HTMLUListElement | null>(null);
  const imgLoadedRef = useRef<ImageLoaded>({});
  const gifDataRef = useRef<GifData>({});
  const workInViewRef = useRef<WorkInView | null>(null);
  const [windowLoaded, setWindowLoaded] = useState<boolean>(Window.loaded);
  const [showGIF, setShowGIF] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [imgLoaded, _setImgLoaded] = useState<ImageLoaded>({});
  const setImgLoaded = (data: ImageLoaded) => {
    imgLoadedRef.current = data;
    _setImgLoaded(data);
  };
  const [gifData, _setGifData] = useState<GifData>({});
  const setGifData = (data: GifData) => {
    gifDataRef.current = data;
    _setGifData(data);
  };
  const [workInView, _setWorkInView] = useState<WorkInView | null>(null);
  const setWorkInView = (data: WorkInView | null) => {
    workInViewRef.current = data;
    _setWorkInView(data);
  };
  const [progress, setProgress] = useState<number>(0);
  const downloadWorkGIF = async (work: WorkInView | null) => {
    if (!work) {
      return;
    }

    const { id, gif } = work;
    let axios;

    try {
      if (downloadingGIF.current === id || !imgLoadedRef.current[id]) {
        return;
      }

      if (gifDataRef.current[id]) {
        return setShowGIF(true);
      }

      downloadingGIF.current = id;

      // Dynamically import Axios
      axios = (await import('axios')).default;
      const source = axios.CancelToken.source();
      axiosSource.current = source;

      const res = await axios(gif, {
        responseType: 'arraybuffer',
        cancelToken: source.token,
        onDownloadProgress: (e) =>
          setProgress(Math.round((e.loaded / e.total) * 100)),
      });

      setGifData({
        ...gifDataRef.current,
        [id]: getImageDataFromResponse(res),
      });
      downloadingGIF.current = null;

      // Give buffer time for animation after downloading GIF data
      timeouts.current.timeoutShowGIF = window.setTimeout(
        () => setShowGIF(true),
        100
      );

      trackEvent({
        action: 'gif_auto_play_start',
        category: 'gif_auto_play',
        label: `Downloaded GIF - ${work.title}`,
        nonInteraction: true,
      });
    } catch (err) {
      if (axios && axios.isCancel(err)) {
        console.warn(`Cancel Work GIF download: ${gif}`);
        downloadingGIF.current = null;
      } else {
        console.error('Error on Work GIF download:', err);
      }
    }
  };
  const cancelDownloadWorkGIF = (newId: string) => {
    if (axiosSource.current && downloadingGIF.current !== newId) {
      axiosSource.current.cancel();
      axiosSource.current = null;
      setWorkInView(null);
      setShowSpinner(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    Window.on('load', () => setWindowLoaded(true));

    Window.on('scroll', () => {
      if (!worksEl.current) {
        return;
      }

      const { scrollY, innerHeight } = window;

      // Auto-play GIF
      clearTimeout(timeouts.current.timeoutWorkInView);
      clearTimeout(timeouts.current.timeoutShowGIF);
      clearTimeout(timeouts.current.timeoutShowSpinner);
      setShowGIF(false);

      let newWorkInView: WorkInView | null = null;
      let nodeImg;

      for (const node of worksEl.current.children) {
        if (node instanceof HTMLElement) {
          nodeImg = node.querySelector<HTMLDivElement>('.img');

          if (!nodeImg) {
            continue;
          }

          if (
            nodeImg.offsetTop >= scrollY &&
            nodeImg.offsetTop + nodeImg.offsetHeight <= scrollY + innerHeight
          ) {
            const { id, gif, title } = node.dataset;

            if (id && gif && title) {
              newWorkInView = {
                id,
                gif,
                title,
              };
              break;
            }
          }
        }
      }

      if (newWorkInView) {
        cancelDownloadWorkGIF(newWorkInView.id);

        timeouts.current.timeoutWorkInView = window.setTimeout(() => {
          setWorkInView(newWorkInView);
          downloadWorkGIF(newWorkInView);

          // Delay showing of spinner in case GIF loads within the timeout
          timeouts.current.timeoutShowSpinner = window.setTimeout(
            () => setShowSpinner(true),
            DOWNLOAD_GIF_SPINNER_TIMEOUT
          );
        }, SET_WORK_IN_VIEW_TIMEOUT);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="works page-section">
      <div className="section-title">
        <h2 className="title">My Projects</h2>
        <div className="desc">A bunch of things I've done so far.</div>
      </div>
      <ul ref={worksEl}>
        {WORKS.map((work, index) => {
          const id = `work-${index}`;

          return (
            <li
              key={id}
              data-id={id}
              data-gif={work.gif}
              data-title={work.title}
              data-testid={id}
            >
              <div className="img">
                {windowLoaded ? (
                  <div className="wrapper">
                    <LazyLoad offset={window.innerHeight} once>
                      <img
                        src={work.img}
                        alt={work.title}
                        className="static"
                        draggable={false}
                        onLoad={() => {
                          setImgLoaded({
                            ...imgLoadedRef.current,
                            [id]: true,
                          });

                          if (
                            workInViewRef.current &&
                            workInViewRef.current.id === id
                          ) {
                            cancelDownloadWorkGIF(id);
                            downloadWorkGIF({
                              ...work,
                              id,
                            });
                          }
                        }}
                      />
                    </LazyLoad>
                    {work.gif && gifData[id] ? (
                      <CSSTransition
                        in={
                          showGIF && workInView && workInView.id === id
                            ? true
                            : false
                        }
                        timeout={300}
                        classNames="gif"
                        mountOnEnter
                        unmountOnExit
                      >
                        <img
                          src={gifData[id]}
                          alt={`${work.title} GIF`}
                          draggable={false}
                          className="gif"
                        />
                      </CSSTransition>
                    ) : null}
                    {imgLoaded[id] &&
                    !gifData[id] &&
                    showSpinner &&
                    workInView &&
                    workInView.id === id ? (
                      <div
                        onMouseEnter={() =>
                          trackHover(`Downloading GIF - ${work.title}`)
                        }
                        className="spinner-container"
                      >
                        <div className="spinner" />
                        <div className="text">{progress}</div>
                        <Tooltip position="right">Downloading GIF...</Tooltip>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {!windowLoaded || !imgLoaded[id] ? (
                  <div className="spinner"></div>
                ) : null}
              </div>
              <div className="info">
                <div className="title">
                  {work.starred ? (
                    <div
                      onMouseEnter={() =>
                        trackHover(`Best Project - ${work.title}`)
                      }
                      className="icon"
                    >
                      <StarIcon />
                      <Tooltip>Best Project</Tooltip>
                    </div>
                  ) : null}
                  {work.title}
                </div>
                <div className="desc">{work.desc}</div>
                <div className="btns">
                  {work.urls.map((item, index) => (
                    <div key={index} className="btn">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-text"
                        onClick={trackOutboundLink}
                        onContextMenu={trackOutboundLink}
                      >
                        {item.title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Works;
