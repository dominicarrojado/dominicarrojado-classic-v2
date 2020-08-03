import React, { useRef, useState, useEffect } from 'react';
import classnames from 'classnames';

import './FooterQuotes.css';

import { FAVORITE_QUOTES } from '../constants';

function FooterQuotes() {
  const interval = useRef<number>();
  const quoteEl = useRef<HTMLLIElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const setQuoteHeight = () => {
    if (quoteEl.current) {
      setHeight(quoteEl.current.offsetHeight);
    }
  };

  useEffect(() => {
    setQuoteHeight();

    interval.current = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        if (currentIndex < FAVORITE_QUOTES.length - 1) {
          return currentIndex + 1;
        } else {
          return 0;
        }
      });
      setQuoteHeight();
    }, 5000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <ul className="footer-quotes" style={{ height }}>
      {FAVORITE_QUOTES.map((item, index) => (
        <li
          ref={activeIndex === index ? quoteEl : null}
          key={index}
          className={classnames({ show: activeIndex === index })}
        >
          “{item.quote}”
          <br />— {item.author}
        </li>
      ))}
    </ul>
  );
}

export default FooterQuotes;
