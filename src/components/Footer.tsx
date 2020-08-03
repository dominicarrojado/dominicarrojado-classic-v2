import React from 'react';

import './Footer.css';

import FooterQuotes from './FooterQuotes';
import FooterSocialItem from './FooterSocialItem';

import { SOCIAL_LINKS } from '../constants';

function Footer() {
  return (
    <footer className="footer-main">
      <FooterQuotes />
      <ul className="social">
        {SOCIAL_LINKS.map((item) => (
          <FooterSocialItem key={item.name} social={item} />
        ))}
      </ul>
      <div className="credits">
        © Dominic Arrojado {new Date().getFullYear()}
      </div>
    </footer>
  );
}

export default Footer;
