import { useRef, useState, useEffect } from 'react';
import classnames from 'classnames';

import Window from '../modules/Window';
import { trackEvent } from '../lib/google-analytics';
import { getRefValue } from '../lib/hooks';

import './Hero.css';

import { ReactComponent as Logo } from '../assets/images/icons/dominic-arrojado.svg';
import { ReactComponent as ArrowDownIcon } from '../assets/images/icons/arrow-down-solid.svg';

import { GoogleAnalyticsEvents } from '../types';
import { ABOUT_ME_ELEMENT_ID } from '../constants';

const SCROLL_DOWN_TEXT = 'Scroll Down';

function Hero() {
  const aboutMeRef = useRef<HTMLElement | null>(null);
  const moveToRef = useRef<MoveTo>();
  const heroImgRef = useRef<HTMLDivElement>(null);
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const heroDescRef = useRef<HTMLDivElement>(null);
  const [windowLoaded, setWindowLoaded] = useState(Window.loaded);
  const scrollDownOnClick = () => {
    let aboutMeEl: HTMLElement | null = getRefValue(aboutMeRef);

    if (!aboutMeEl) {
      aboutMeEl = document.getElementById(ABOUT_ME_ELEMENT_ID);
      aboutMeRef.current = aboutMeEl;
    }

    const moveToFunc = getRefValue(moveToRef);

    if (moveToFunc && aboutMeEl) {
      moveToFunc.move(aboutMeEl);
    }

    trackEvent({
      event: GoogleAnalyticsEvents.SCROLL_CLICK,
      linkText: SCROLL_DOWN_TEXT,
    });
  };

  useEffect(() => {
    const windowOnLoad = async () => {
      setWindowLoaded(true);

      // Dynamically import MoveTo
      try {
        const { default: MoveTo } = await import('moveto');
        moveToRef.current = new MoveTo({ duration: 100 });
      } catch (err) {
        console.error('Error on MoveTo import:', err);
      }
    };

    const windowOnScroll = () => {
      const heroImgEl = getRefValue(heroImgRef);
      const heroLogoEl = getRefValue(heroLogoRef);
      const heroDescEl = getRefValue(heroDescRef);

      if (
        heroImgEl &&
        heroLogoEl &&
        heroDescEl &&
        window.pageYOffset <= window.innerHeight
      ) {
        // Parallax effect
        heroImgEl.style.transform = `translate3d(0, ${
          window.pageYOffset * 0.2
        }px, 0)`;

        // Opacity effect
        const { offsetTop, offsetHeight } = heroDescEl;
        const opacity = Math.max(
          1 - window.pageYOffset / (offsetTop + offsetHeight),
          0
        );

        heroLogoEl.style.opacity = `${opacity}`;
        heroDescEl.style.opacity = `${opacity}`;
      }
    };

    Window.on('load', windowOnLoad);
    Window.on('scroll', windowOnScroll);

    return () => {
      Window.off('load', windowOnLoad);
      Window.off('scroll', windowOnScroll);
    };
  }, []);

  return (
    <section className={classnames('hero', { show: windowLoaded })}>
      <div ref={heroImgRef} className="img" data-testid="img"></div>
      {!windowLoaded && <div className="spinner" />}
      <div className="main">
        <div ref={heroLogoRef} className="logo-container" data-testid="logo">
          <Logo className="logo" />
        </div>
        <div ref={heroDescRef} className="desc-container" data-testid="desc">
          <h1 className="desc">Dominic Arrojado · Lead Engineer</h1>
        </div>
      </div>
      <div className="btn">
        <span
          className="btn-text btn-white"
          role="button"
          onClick={scrollDownOnClick}
        >
          {SCROLL_DOWN_TEXT}
        </span>
        <div className="icon">
          <ArrowDownIcon />
        </div>
      </div>
    </section>
  );
}

export default Hero;
