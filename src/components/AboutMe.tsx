import React from 'react';
import { trackOutboundLink } from '../lib/google-analytics';

import './AboutMe.css';

function AboutMe() {
  return (
    <section id="aboutMe" className="page-section about-me">
      <div className="section-title">
        <h2 className="title">About Me</h2>
        <div className="desc">
          I'm Dominic Arrojado and my passion is turning design into code. I'm a
          web developer specializing in both front-end &amp; back-end
          development. I'm experienced in developing small to large web
          applications.
          <br />
          <br />
          I'm currently based in Singapore and working at{' '}
          <a
            href="https://www.propertyguru.com.sg/mortgage"
            target="_blank"
            className="btn-text"
            rel="noopener noreferrer"
            onClick={trackOutboundLink}
          >
            PropertyGuru
          </a>{' '}
          as a Senior Software Engineer (FinTech).
        </div>
      </div>
    </section>
  );
}

export default AboutMe;
