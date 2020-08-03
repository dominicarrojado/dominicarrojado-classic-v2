import React, {
  Fragment,
  useRef,
  useState,
  ReactNode,
  MouseEventHandler,
  SyntheticEvent,
} from 'react';

import { trackOutboundLink } from '../lib/google-analytics';
import { copyTextToClipboard } from '../lib/dom';

import './FooterSocialItem.css';

import { ReactComponent as LinkedInIcon } from '../assets/images/icons/linkedin-brands.svg';
import { ReactComponent as GitHubIcon } from '../assets/images/icons/github-brands.svg';
import { ReactComponent as EnvelopeIcon } from '../assets/images/icons/envelope-regular.svg';

import Tooltip from './Tooltip';

type Props = {
  social: {
    name: string;
    title: string;
    url: string;
  };
};

function FooterSocialItem(props: Props) {
  const { social } = props;
  const timeout = useRef<number>();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  let target: string = '_blank';
  let icon: ReactNode = null;
  let onClick: MouseEventHandler<HTMLAnchorElement> | null = null;

  switch (social.name) {
    case 'linkedin':
      icon = (
        <Fragment>
          <LinkedInIcon />
          <Tooltip>{social.title}</Tooltip>
        </Fragment>
      );
      break;

    case 'github':
      icon = (
        <Fragment>
          <GitHubIcon />
          <Tooltip>{social.title}</Tooltip>
        </Fragment>
      );
      break;

    case 'email': {
      target = '_self';
      icon = (
        <Fragment>
          <EnvelopeIcon />
          <Tooltip isMounted={showTooltip}>
            {!showTooltip ? social.title : 'Copied!'}
          </Tooltip>
        </Fragment>
      );
      onClick = (e: SyntheticEvent) => {
        const email = social.url.replace('mailto:', '');
        const copied = copyTextToClipboard(email);

        if (copied) {
          e.preventDefault();
          clearTimeout(timeout.current);
          setShowTooltip(true);
        }
      };
      break;
    }

    default:
      icon = null;
  }

  return (
    <li className="footer-social-item">
      <a
        href={social.url}
        target={target}
        rel="noopener noreferrer"
        data-testid={social.name}
        onClick={(e) => {
          trackOutboundLink(e);

          if (typeof onClick === 'function') {
            onClick(e);
          }
        }}
        onMouseEnter={() => {
          clearTimeout(timeout.current);
          setShowTooltip(false);
        }}
        onMouseLeave={() => {
          timeout.current = window.setTimeout(() => setShowTooltip(false), 200);
        }}
      >
        {icon}
      </a>
    </li>
  );
}

export default FooterSocialItem;
