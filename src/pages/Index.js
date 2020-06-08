import React, { useRef, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import LazyLoad from 'react-lazyload';
import MoveTo from 'moveto';

import { getImageDataFromResponse } from '../lib/axios';
import { trackOutboundLink, trackHover } from '../lib/google-analytics';

import './Index.css';

import { ReactComponent as Logo } from '../assets/images/icons/dominic-arrojado.svg';
import { ReactComponent as ArrowDownIcon } from '../assets/images/icons/arrow-down-solid.svg';
import { ReactComponent as StarIcon } from '../assets/images/icons/star-solid.svg';

import Footer from '../components/Footer';
import Tooltip from '../components/Tooltip';

import { COMPANY_URL, WORKS } from '../constants';

function Index() {
  const heroImg = useRef();
  const heroLogo = useRef();
  const heroDesc = useRef();
  const aboutMe = useRef();
  const works = useRef();
  const moveTo = useRef();
  const timeoutsRef = useRef({});
  const imgLoadedRef = useRef({});
  const gifDataRef = useRef({});
  const workInViewRef = useRef();
  const downloadingGifRef = useRef();
  const sourceRef = useRef();
  const [windowLoaded, setWindowLoaded] = useState(false);
  const [showGIF, setShowGIF] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [imgLoaded, _setImgLoaded] = useState({});
  const [gifData, _setGifData] = useState({});
  const [workInView, _setWorkInView] = useState('');
  const [progress, setProgress] = useState(0);
  const setImgLoaded = data => {
    imgLoadedRef.current = data;
    _setImgLoaded(data);
  };
  const setGifData = data => {
    gifDataRef.current = data;
    _setGifData(data);
  };
  const setWorkInView = data => {
    workInViewRef.current = data;
    _setWorkInView(data);
  };

  useEffect(() => {
    moveTo.current = new MoveTo({ duration: 100 });

    if (document.readyState === 'complete') {
      setWindowLoaded(true);
    } else {
      window.addEventListener('load', () => setWindowLoaded(true));
    }

    window.addEventListener('scroll', () => {
      const { scrollY, innerHeight } = window;

      // Parallax
      if (scrollY <= innerHeight) {
        heroImg.current.style.transform = `translate3d(0, ${
          window.pageYOffset * 0.2
        }px, 0)`;

        const { offsetTop, offsetHeight } = heroDesc.current;
        const opacity = Math.max(1 - scrollY / (offsetTop + offsetHeight), 0);

        heroLogo.current.style.opacity = opacity;
        heroDesc.current.style.opacity = opacity;
      }

      // Auto-play GIF
      clearTimeout(timeoutsRef.current.timeoutWorkInView);
      clearTimeout(timeoutsRef.current.timeoutShowGIF);
      clearTimeout(timeoutsRef.current.timeoutShowSpinner);
      setShowGIF(false);

      let newWorkInView;
      let nodeImg;
      let nodeGif;

      for (const node of works.current.children) {
        nodeImg = node.querySelector('.img');

        if (!nodeImg) {
          continue;
        }

        if (
          nodeImg.offsetTop >= scrollY &&
          nodeImg.offsetTop + nodeImg.offsetHeight <= scrollY + innerHeight
        ) {
          newWorkInView = node.id;
          nodeGif = node.dataset.gif;
          break;
        }
      }

      if (newWorkInView) {
        cancelDownloadGifData(newWorkInView);

        timeoutsRef.current.timeoutWorkInView = setTimeout(() => {
          setWorkInView(newWorkInView);
          downloadGifData(newWorkInView, nodeGif);

          // Delay showing of spinner in case GIF loads within 300ms
          timeoutsRef.current.timeoutShowSpinner = setTimeout(
            () => setShowSpinner(true),
            300
          );
        }, 500);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cancel GIF download if it's not the same work in view anymore
  function cancelDownloadGifData(newId) {
    const currentId = downloadingGifRef.current;

    if (sourceRef.current && currentId !== newId) {
      sourceRef.current.cancel();
      sourceRef.current = null;
      setWorkInView('');
      setShowSpinner(false);
      setProgress(0);
    }
  }

  async function downloadGifData(id, url) {
    let axios;

    try {
      if (downloadingGifRef.current === id || !imgLoadedRef.current[id]) {
        return;
      }

      if (gifDataRef.current[id]) {
        return setShowGIF(true);
      }

      downloadingGifRef.current = id;

      axios = (await import('axios')).default;
      const source = axios.CancelToken.source();
      sourceRef.current = source;

      const res = await axios(url, {
        responseType: 'arraybuffer',
        cancelToken: source.token,
        onDownloadProgress: e =>
          setProgress(Math.round((e.loaded / e.total) * 100)),
      });

      setGifData({
        ...gifDataRef.current,
        [id]: getImageDataFromResponse(res),
      });
      downloadingGifRef.current = '';

      // Give buffer time for animation after downloading GIF data
      timeoutsRef.current.timeoutShowGIF = setTimeout(
        () => setShowGIF(true),
        100
      );
    } catch (err) {
      if (axios && axios.isCancel(err)) {
        console.error(`Cancel GIF download - ${id}, ${url}`);
        downloadingGifRef.current = '';
      } else {
        console.error(err);
      }
    }
  }

  return (
    <div className="page-index">
      <section className={`hero ${windowLoaded ? 'animate' : ''}`}>
        <div ref={heroImg} className="img"></div>
        {!windowLoaded ? <div className="spinner" /> : null}
        <div className="main">
          <div ref={heroLogo} className="logo-container">
            <Logo className="logo" />
          </div>
          <div ref={heroDesc} className="desc-container">
            <h1 className="desc">
              Dominic Arrojado · Senior Software Engineer
            </h1>
          </div>
        </div>
        <div className="btn">
          <span
            onClick={() =>
              moveTo.current && moveTo.current.move(aboutMe.current)
            }
            className="btn-text btn-white"
          >
            Scroll Down
          </span>
          <div className="icon">
            <ArrowDownIcon />
          </div>
        </div>
      </section>

      <section ref={aboutMe} className="page-section about-me">
        <div className="section-title">
          <h2 className="title">About Me</h2>
          <div className="desc">
            I'm Dominic Arrojado and my passion is turning design into code. I'm
            a web developer specializing in both front-end &amp; back-end
            development. I'm experienced in developing small to large web
            applications.
            <br />
            <br />
            I'm currently based in Singapore and working at{' '}
            <a
              href={COMPANY_URL}
              onClick={trackOutboundLink}
              target="_blank"
              className="btn-text"
              rel="noopener noreferrer"
            >
              Razer
            </a>{' '}
            as a Senior Software Engineer.
          </div>
        </div>
      </section>

      <section className="works page-section ">
        <div className="section-title">
          <h2 className="title">My Projects</h2>
          <div className="desc">A bunch of things I've done so far.</div>
        </div>
        <ul ref={works}>
          {WORKS.map((work, index) => {
            const id = `work-${index}`;

            return (
              <li key={id} id={id} data-gif={work.gif}>
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

                            if (workInViewRef.current === id) {
                              cancelDownloadGifData(id);
                              downloadGifData(id, work.gif);
                            }
                          }}
                        />
                      </LazyLoad>
                      {work.gif && gifData[id] ? (
                        <CSSTransition
                          in={showGIF && workInView === id}
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
                      workInView === id ? (
                        <div
                          onMouseEnter={() =>
                            trackHover(`Loading GIF (${work.title})`)
                          }
                          className="spinner-container"
                        >
                          <div className="spinner" />
                          <div className="text">{progress}</div>
                          <Tooltip position="right">Loading GIF...</Tooltip>
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
                          trackHover(`Best Project (${work.title})`)
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
                          onClick={trackOutboundLink}
                          onContextMenu={trackOutboundLink}
                          className="btn-text"
                          target="_blank"
                          rel="noopener noreferrer"
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

      <Footer />
    </div>
  );
}

export default Index;
