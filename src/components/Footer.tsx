import { useMemo } from 'react';

import './Footer.css';

import FooterQuotes from './FooterQuotes';
import FooterSocialItem from './FooterSocialItem';

import { SOCIAL_LINKS } from '../constants';

function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer-main">
      <FooterQuotes />
      <ul className="social">
        {SOCIAL_LINKS.map((item) => (
          <FooterSocialItem key={item.name} social={item} />
        ))}
      </ul>
      <div className="credits">© Dominic Arrojado {currentYear}</div>
    </footer>
  );
}

export default Footer;
