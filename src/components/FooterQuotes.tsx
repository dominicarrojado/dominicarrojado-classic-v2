import { useRef, useState, useEffect } from 'react';
import classnames from 'classnames';
import { getRefValue } from '../lib/hooks';

import './FooterQuotes.css';

import { FAVORITE_QUOTES, FOOTER_QUOTES_INTERVAL } from '../constants';

function FooterQuotes() {
  const intervalRef = useRef<number>();
  const quoteRef = useRef<HTMLLIElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [height, setHeight] = useState(0);
  const setQuoteHeight = () => {
    const quoteEl = getRefValue(quoteRef);

    if (quoteEl) {
      setHeight(quoteEl.offsetHeight);
    }
  };

  useEffect(() => {
    setQuoteHeight();

    intervalRef.current = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        if (currentIndex < FAVORITE_QUOTES.length - 1) {
          return currentIndex + 1;
        } else {
          return 0;
        }
      });
      setQuoteHeight();
    }, FOOTER_QUOTES_INTERVAL);

    return () => {
      clearInterval(getRefValue(intervalRef));
    };
  }, []);

  return (
    <ul className="footer-quotes" style={{ height }}>
      {FAVORITE_QUOTES.map((item, index) => (
        <li
          ref={activeIndex === index ? quoteRef : null}
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
