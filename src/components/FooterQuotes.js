import React, { useRef, useState, useEffect } from 'react';

import './FooterQuotes.css';

import { FAVORITE_QUOTES } from '../constants';

function FooterQuotes() {
  const quote = useRef();
  const intervalRef = useRef();
  const activeIndexRef = useRef();
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(Math.random() * FAVORITE_QUOTES.length)
  );
  const [height, setHeight] = useState(0);

  function setQuoteHeight() {
    setHeight(quote.current.offsetHeight);
  }

  useEffect(() => {
    setQuoteHeight();

    intervalRef.current = setInterval(() => {
      setActiveIndex(
        activeIndexRef.current < FAVORITE_QUOTES.length - 1
          ? activeIndexRef.current + 1
          : 0
      );
      setQuoteHeight();
    }, 5000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <ul style={{ height }} className="footer-quotes">
      {FAVORITE_QUOTES.map((item, index) => (
        <li
          ref={activeIndex === index ? quote : null}
          key={index}
          className={activeIndex === index ? 'show' : ''}
        >
          “{item.quote}”
          <br />— {item.author}
        </li>
      ))}
    </ul>
  );
}

export default FooterQuotes;
