import React, { useRef, useState, useEffect } from 'react';

import Window from '../modules/Window';
import { trackEvent } from '../lib/google-analytics';

import './Hero.css';

import { ReactComponent as Logo } from '../assets/images/icons/dominic-arrojado.svg';
import { ReactComponent as ArrowDownIcon } from '../assets/images/icons/arrow-down-solid.svg';

function Hero() {
  const aboutMeEl = useRef<HTMLElement | null>(null);
  const moveTo = useRef<MoveTo>();
  const heroImgEl = useRef<HTMLDivElement | null>(null);
  const heroLogoEl = useRef<HTMLDivElement | null>(null);
  const heroDescEl = useRef<HTMLDivElement | null>(null);
  const [windowLoaded, setWindowLoaded] = useState<boolean>(Window.loaded);

  useEffect(() => {
    Window.on('load', () => {
      setWindowLoaded(true);

      // Dynamically import MoveTo
      import('moveto')
        .then(
          ({ default: MoveTo }) =>
            (moveTo.current = new MoveTo({ duration: 100 }))
        )
        .catch((err) => console.error('Error on MoveTo import:', err));
    });

    Window.on('scroll', () => {
      if (
        heroImgEl.current &&
        heroLogoEl.current &&
        heroDescEl.current &&
        window.scrollY <= window.innerHeight
      ) {
        // Parallax
        heroImgEl.current.style.transform = `translate3d(0, ${
          window.pageYOffset * 0.2
        }px, 0)`;

        // Opacity effect
        const { offsetTop, offsetHeight } = heroDescEl.current;
        const opacity = Math.max(
          1 - window.scrollY / (offsetTop + offsetHeight),
          0
        );

        heroLogoEl.current.style.opacity = `${opacity}`;
        heroDescEl.current.style.opacity = `${opacity}`;
      }
    });
  }, []);

  return (
    <section className={`hero ${windowLoaded ? 'show' : ''}`}>
      <div ref={heroImgEl} className="img"></div>
      {!windowLoaded ? <div className="spinner" /> : null}
      <div className="main">
        <div ref={heroLogoEl} className="logo-container">
          <Logo className="logo" />
        </div>
        <div ref={heroDescEl} className="desc-container">
          <h1 className="desc">Dominic Arrojado · Senior Software Engineer</h1>
        </div>
      </div>
      <div className="btn">
        <span
          role="button"
          onClick={() => {
            let aboutMe = aboutMeEl.current;

            if (!aboutMe) {
              aboutMe = document.getElementById('aboutMe');
              aboutMeEl.current = aboutMe;
            }

            if (moveTo.current && aboutMe) {
              moveTo.current.move(aboutMe);

              trackEvent({
                action: 'click',
                category: 'user_interaction',
                label: 'Scroll Down',
              });
            }
          }}
          className="btn-text btn-white"
        >
          Scroll Down
        </span>
        <div className="icon">
          <ArrowDownIcon />
        </div>
      </div>
    </section>
  );
}

export default Hero;
