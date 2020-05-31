import React, { useRef, useState, useEffect } from 'react';
import LazyLoad from 'react-lazyload';
import MoveTo from 'moveto';

import { trackOutboundLink, trackHover } from '../lib/google-analytics';

import './Index.css';

import { ReactComponent as Logo } from '../assets/images/icons/dominic-arrojado.svg';
import { ReactComponent as ArrowDownIcon } from '../assets/images/icons/arrow-down-solid.svg';
import { ReactComponent as StarIcon } from '../assets/images/icons/star-solid.svg';

import Footer from '../components/Footer';

import { COMPANY_URL, WORKS } from '../constants';
import Tooltip from '../components/Tooltip';

function Index() {
  const heroImg = useRef();
  const heroLogo = useRef();
  const heroDesc = useRef();
  const aboutMe = useRef();
  const works = useRef();
  const moveTo = useRef();
  const gifLoadedRef = useRef();
  const [animate, setAnimate] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});
  const [gifLoaded, setGifLoaded] = useState({});
  const [workInView, setWorkInView] = useState();

  useEffect(() => {
    moveTo.current = new MoveTo({ duration: 100 });

    if (document.readyState === 'complete') {
      setAnimate(true);
    } else {
      window.addEventListener('load', () => setAnimate(true));
    }

    let timeoutWorkInView;

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

      // Playing GIF of works
      clearTimeout(timeoutWorkInView);
      setWorkInView('');

      let newWorkInView;
      let nodeImg;

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
          break;
        }
      }

      if (newWorkInView) {
        timeoutWorkInView = setTimeout(() => setWorkInView(newWorkInView), 500);
      }
    });
  }, []);

  useEffect(() => {
    gifLoadedRef.current = gifLoaded;
  }, [gifLoaded]);

  return (
    <div className="page-index">
      <section className={`hero ${animate ? 'animate' : ''}`}>
        <div ref={heroImg} className="img"></div>
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
              <li key={id} id={id} data-brand={work.brand}>
                <div className="img">
                  <div className="wrapper">
                    <LazyLoad offset={window.innerHeight}>
                      <img
                        src={work.img}
                        alt={work.title}
                        className="static"
                        draggable={false}
                        onLoad={
                          work.gif
                            ? () =>
                                setImgLoaded({
                                  ...imgLoaded,
                                  [id]: true,
                                })
                            : null
                        }
                      />
                    </LazyLoad>
                    {work.gif && imgLoaded[id] ? (
                      <img
                        src={work.gif}
                        alt={`${work.title} GIF`}
                        className={`gif ${
                          workInView === id && gifLoaded[id] ? 'show' : ''
                        }`}
                        draggable={false}
                        onLoad={() =>
                          setGifLoaded({
                            ...gifLoaded,
                            [id]: true,
                          })
                        }
                      />
                    ) : null}
                  </div>
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
