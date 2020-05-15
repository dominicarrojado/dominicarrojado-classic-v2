import React, { useRef, useState, useEffect } from 'react';
import LazyLoad from 'react-lazyload';
import MoveTo from 'moveto';

import { trackOutboundLink } from '../lib/google-anayltics';

import './Index.css';

import Logo from '../icons/Logo';
import Footer from '../components/Footer';
import ArrowDownIcon from '../icons/ArrowDownIcon';

import { COMPANY_URL, WORKS } from '../constants';

const moveTo = new MoveTo({ duration: 100 });

function Index() {
  const heroImg = useRef();
  const heroLogo = useRef();
  const heroDesc = useRef();
  const aboutMe = useRef();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setAnimate(true);
    } else {
      window.addEventListener('load', () => setAnimate(true));
    }

    // Parallax
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight) {
        return;
      }

      heroImg.current.style.transform = `translate3d(0, ${
        window.pageYOffset * 0.2
      }px, 0)`;

      const opacity = 1 - (window.scrollY / document.body.scrollHeight) * 20;

      heroLogo.current.style.opacity = opacity;
      heroDesc.current.style.opacity = opacity;
    });
  }, []);

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
            onClick={() => moveTo.move(aboutMe.current)}
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
        <ul>
          {WORKS.map((work, index) => (
            <li key={index} id={`work-${index}`} data-brand={work.brand}>
              <div className="img">
                <LazyLoad offset={window.innerHeight}>
                  <img src={work.img} alt={work.title} />
                </LazyLoad>
              </div>
              <div className="info">
                <div className="title">{work.title}</div>
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
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
}

export default Index;
