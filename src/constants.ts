import { getPublicURL } from './lib/common';
import { Quote, Social, SocialNames, Work } from './types';

export const MAIN_URL = 'https://dominicarrojado.com';
export const SET_WORK_IN_VIEW_TIMEOUT = 500;
export const DOWNLOAD_GIF_SPINNER_TIMEOUT = 300;
export const FOOTER_QUOTES_INTERVAL = 5000;
export const ABOUT_ME_ELEMENT_ID = 'aboutMe';

export const WORKS: Array<Work> = [
  {
    title: 'THX Spatial Audio',
    desc: 'Web-based desktop application that delivers advanced 7.1 surround sound with pinpoint positional accuracy to make your game come alive.',
    urls: [
      {
        title: 'View Page',
        url: 'https://www.razer.com/thx-spatial-audio',
      },
    ],
    img: getPublicURL('/works/thx-spatial-audio-web-app.png'),
    gif: getPublicURL('/works/thx-spatial-audio-web-app.gif'),
  },
  {
    title: 'Razer Training Mode: Virus Edition',
    desc: 'Whack-a-mole mini-game where you whack viruses instead of moles.',
    urls: [
      {
        title: 'View Game',
        url: 'https://dominicarrojado.com/mouse-accuracy-game/',
      },
    ],
    img: getPublicURL('/works/razer-training-mode-virus-edition-app.png'),
    gif: getPublicURL('/works/razer-training-mode-virus-edition-app.gif'),
  },
  {
    title: 'Razer Chroma Studio Web',
    desc: 'A module of Razer Synapse recreated in web that allows you to create various lighting effects and synchronize across multiple devices, while allowing you to follow the exact placement of your devices on your desktop.',
    urls: [
      {
        title: 'Watch Demo',
        url: 'https://youtu.be/kFBe_wSwIMQ',
      },
    ],
    img: getPublicURL('/works/razer-chroma-studio-web-app.png'),
    gif: getPublicURL('/works/razer-chroma-studio-web-app.gif'),
    starred: true,
  },
  {
    title: 'Razer Streamer Companion App',
    desc: 'Web-based desktop application where you can create unique audience interactions with supported Razer hardware.',
    urls: [
      {
        title: 'View Page',
        url: 'https://www.razer.com/streamer-companion-app/',
      },
    ],
    img: getPublicURL('/works/razer-streamer-companion-web-app.png'),
    gif: getPublicURL('/works/razer-streamer-companion-web-app.gif'),
  },
  {
    title: 'Razer 7.1 Surround Sound',
    desc: 'Web-based desktop application for superior positional audio and a lifelike gaming experience.',
    urls: [
      {
        title: 'View Page',
        url: 'https://www.razer.com/7.1-surround-sound/',
      },
    ],
    img: getPublicURL('/works/razer-7.1-surround-sound-web-app.png'),
    gif: getPublicURL('/works/razer-7.1-surround-sound-web-app.gif'),
  },
  {
    title: 'Razer Developer Portal',
    desc: 'A portal for third-party developers to manage their projects that uses Razer ID API.',
    urls: [
      {
        title: 'View Web App',
        url: 'https://api.razer.com/',
      },
    ],
    img: getPublicURL('/works/razer-developer-portal-web-app.png'),
    gif: getPublicURL('/works/razer-developer-portal-web-app.gif'),
  },
  {
    title: 'Razer ID',
    desc: 'Profile management and authentication service tool for all Razer services. Built for web, desktop and mobile.',
    urls: [
      {
        title: 'View Web App',
        url: 'https://razerid.razer.com/',
      },
    ],
    img: getPublicURL('/works/razer-id-web-app.png'),
    gif: getPublicURL('/works/razer-id-web-app.gif'),
  },
  {
    title: 'Qwerk',
    desc: 'Project management + chat tool for productivity. It has notes and timer feature as well.',
    urls: [
      {
        title: 'View Web App',
        url: 'https://www.justqwerk.com/',
      },
    ],
    img: getPublicURL('/works/qwerk-web-app.png'),
    gif: getPublicURL('/works/qwerk-web-app.gif'),
    starred: true,
  },
  {
    title: 'Maybank: FC Barcelona',
    desc: "Website for Maybank to introduce its FC Barcelona Visa Signature Card. Maybank is one of the world's most valuable bank brands.",
    urls: [
      {
        title: 'View Website',
        url: 'https://dominicarrojado.com/maybank-fc-barcelona-website/',
      },
    ],
    img: getPublicURL('/works/maybank-fc-barcelona-website.png'),
    gif: getPublicURL('/works/maybank-fc-barcelona-website.gif'),
  },
  {
    title: 'Food Republic: Capsule Surprise',
    desc: "A classic game for Food Republic's Wisma Atria re-opening. Food Republic is a food court chain run by the BreadTalk Group based in Singapore.",
    urls: [
      {
        title: 'View Web App',
        url: 'https://food-republic-capsule-surprise.meteorapp.com/',
      },
    ],
    img: getPublicURL('/works/food-republic-capsule-surprise-web-app.png'),
    gif: getPublicURL('/works/food-republic-capsule-surprise-web-app.gif'),
  },
  {
    title: "Aptamil: Build Your Baby's Foundation to be One Step Ahead",
    desc: 'Campaign for Aptamil to promote the 2 key pillars of foundation: natural defences and brain development.',
    urls: [
      {
        title: 'View Web App',
        url: 'https://aptamil-bybftbosa.meteorapp.com/',
      },
    ],
    img: getPublicURL('/works/aptamil-build-your-babys-foundation-web-app.png'),
    gif: getPublicURL('/works/aptamil-build-your-babys-foundation-web-app.gif'),
  },
  {
    title: 'Kronenbourg 1664',
    desc: 'Website for the most sold French beer in the world and the market leader for high-end premium beers.',
    urls: [
      {
        title: 'View Website',
        url: 'https://dominicarrojado.com/kronenbourg-website/',
      },
    ],
    img: getPublicURL('/works/kronenbourg-website.png'),
    gif: getPublicURL('/works/kronenbourg-website.gif'),
  },
  {
    title: 'Singtel: Data x Infinity',
    desc: "Web app for Singtel's event promoting new mobile data add-on. Singtel is one of the four major telcos operating in  Singapore",
    urls: [
      {
        title: 'View Web App',
        url: 'https://singtel-data-x-infinity.meteorapp.com/',
      },
      {
        title: 'View Slideshow',
        url: 'https://singtel-data-x-infinity-ss.meteorapp.com/',
      },
    ],
    img: getPublicURL('/works/singtel-data-x-infinity-web-app.png'),
    gif: getPublicURL('/works/singtel-data-x-infinity-web-app.gif'),
  },
  {
    title: 'CNB: Anti Drug Abuse Campaign',
    desc: 'Campaign that aims to raise awareness and support for the anti-drug cause in Singapore.',
    urls: [
      {
        title: 'View Web App',
        url: 'https://cnb-adac.meteorapp.com/',
      },
      {
        title: 'View Slideshow',
        url: 'https://cnb-adac-ss.meteorapp.com/',
      },
    ],
    img: getPublicURL('/works/cnb-anti-drug-abuse-campaign-web-app.png'),
    gif: getPublicURL('/works/cnb-anti-drug-abuse-campaign-web-app.gif'),
  },
  {
    title: 'Hashtag Interactive',
    desc: 'Website for a boutique digital marketing agency that is optimised for a digital-centric world.',
    urls: [
      {
        title: 'View Website',
        url: 'https://dominicarrojado.com/hashtag-interactive-website/',
      },
    ],
    img: getPublicURL('/works/hashtag-interactive-website.png'),
    gif: getPublicURL('/works/hashtag-interactive-website.gif'),
  },
  {
    title: 'To My Valentine',
    desc: "Valentine's day card app that lets you send cute e-cards to your special someone.",
    urls: [
      {
        title: 'View Web App',
        url: 'https://hashtag-interactive-tmv.meteorapp.com/',
      },
    ],
    img: getPublicURL('/works/hashtag-interactive-to-my-valentine-web-app.png'),
    gif: getPublicURL('/works/hashtag-interactive-to-my-valentine-web-app.gif'),
  },
  {
    title: 'CNY: Fortune Teller',
    desc: "Quirky lil' 2017 horoscope app to see what the Year of the Rooster has in store for you.",
    urls: [
      {
        title: 'View Web App',
        url: 'https://hashtag-interactive-cny.meteorapp.com/',
      },
    ],
    img: getPublicURL(
      '/works/hashtag-interactive-cny-fortune-teller-web-app.png'
    ),
    gif: getPublicURL(
      '/works/hashtag-interactive-cny-fortune-teller-web-app.gif'
    ),
  },
  {
    title: 'Holly Jolly Memory Game',
    desc: 'Simon-inspired memory game for Christmas by Hashtag Interactive.',
    urls: [
      {
        title: 'View Web App',
        url: 'https://hashtag-interactive-christmas.meteorapp.com/',
      },
    ],
    img: getPublicURL(
      '/works/hashtag-interactive-holly-jolly-memory-game-web-app.png'
    ),
    gif: getPublicURL(
      '/works/hashtag-interactive-holly-jolly-memory-game-web-app.gif'
    ),
  },
  {
    title: 'Welcome to Hashtag!',
    desc: 'HTML email template to welcome new Hashtag Interactive clients.',
    urls: [
      {
        title: 'View Email Template',
        url: 'https://dominicarrojado.com/hashtag-interactive-welcome-edm/',
      },
    ],
    img: getPublicURL('/works/hashtag-interactive-welcome-email-template.png'),
    gif: getPublicURL('/works/hashtag-interactive-welcome-email-template.gif'),
  },
  {
    title: 'M1 Email Templates',
    desc: 'HTML email templates for M1, one of the four major telcos operating in  Singapore.',
    urls: [
      {
        title: 'View Data Passport I',
        url: 'https://dominicarrojado.com/m1-data-passport-edm/',
      },
      {
        title: 'View Data Passport II',
        url: 'https://dominicarrojado.com/m1-data-passport-2-edm/',
      },
      {
        title: 'View Data Passport III',
        url: 'https://dominicarrojado.com/m1-data-passport-3-edm/',
      },
      {
        title: 'View Data Passport IV',
        url: 'https://dominicarrojado.com/m1-data-passport-4-edm/',
      },
    ],
    img: getPublicURL('/works/m1-email-template.png'),
    gif: getPublicURL('/works/m1-email-template.gif'),
  },
  {
    title: 'AXA Email Templates',
    desc: "HTML email templates for AXA, one of the world's leading insurance companies.",
    urls: [
      {
        title: 'View Smart Travel I',
        url: 'https://dominicarrojado.com/axa-smart-travel-edm/',
      },
      {
        title: 'View Smart Travel II',
        url: 'https://dominicarrojado.com/axa-smart-travel-2-edm/',
      },
      {
        title: "View Mother's Day",
        url: 'https://dominicarrojado.com/axa-mothers-day-edm/',
      },
      {
        title: 'View Shield',
        url: 'https://dominicarrojado.com/axa-shield-edm/',
      },
      {
        title: 'View SmartHome',
        url: 'https://dominicarrojado.com/axa-smart-home-edm/',
      },
      {
        title: 'View Singtel Partnership',
        url: 'https://dominicarrojado.com/axa-singtel-edm/',
      },
      {
        title: 'View September Promo',
        url: 'https://dominicarrojado.com/axa-september-promo-edm/',
      },
    ],
    img: getPublicURL('/works/axa-email-template.png'),
    gif: getPublicURL('/works/axa-email-template.gif'),
  },
];

export const SOCIAL_LINKS: Array<Social> = [
  {
    name: SocialNames.LINKEDIN,
    title: 'Connect with me @ LinkedIn!',
    url: 'https://www.linkedin.com/in/dominic-arrojado-75ba03a9/',
  },
  {
    name: SocialNames.GITHUB,
    title: 'Follow me @ GitHub!',
    url: 'https://github.com/dominicarrojado/',
  },
  {
    name: SocialNames.EMAIL,
    title: 'Email me!',
    url: 'mailto:dominicarrojado@gmail.com',
  },
];

export const FAVORITE_QUOTES: Array<Quote> = [
  {
    quote: 'If there is no struggle, there is no progress.',
    author: 'Frederick Douglass',
  },
  {
    quote:
      "It's okay to figure out murder mysteries, but you shouldn't need to figure out code. You should be able to read it.",
    author: 'Steve McConnell',
  },
  {
    quote:
      "If you can't explain it simply, you don't understand it well enough.",
    author: 'Albert Einstein',
  },
  {
    quote: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
  },
];
