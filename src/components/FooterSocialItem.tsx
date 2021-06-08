import {
  Fragment,
  useRef,
  useState,
  useMemo,
  useCallback,
  MouseEventHandler,
} from 'react';

import { trackEvent } from '../lib/google-analytics';
import { copyTextToClipboard } from '../lib/dom';
import { getRefValue } from '../lib/hooks';

import './FooterSocialItem.css';

import { ReactComponent as LinkedInIcon } from '../assets/images/icons/linkedin-brands.svg';
import { ReactComponent as GitHubIcon } from '../assets/images/icons/github-brands.svg';
import { ReactComponent as EnvelopeIcon } from '../assets/images/icons/envelope-regular.svg';

import Tooltip from './Tooltip';

import { GoogleAnalyticsEvents, Social, SocialNames } from '../types';

type Props = {
  social: Social;
};

function FooterSocialItem({ social: { name, title, url } }: Props) {
  const timeoutRef = useRef<number>();
  const clickTrackedRef = useRef(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useMemo(() => {
    if (name === SocialNames.EMAIL) {
      return '_self';
    } else {
      return '_blank';
    }
  }, [name]);
  const icon = useMemo(() => {
    switch (name) {
      case SocialNames.LINKEDIN:
        return (
          <Fragment>
            <LinkedInIcon />
            <Tooltip>{title}</Tooltip>
          </Fragment>
        );

      case SocialNames.GITHUB:
        return (
          <Fragment>
            <GitHubIcon />
            <Tooltip>{title}</Tooltip>
          </Fragment>
        );

      case SocialNames.EMAIL: {
        return (
          <Fragment>
            <EnvelopeIcon />
            <Tooltip isMounted={showTooltip}>
              {!showTooltip ? title : 'Copied!'}
            </Tooltip>
          </Fragment>
        );
      }

      default:
        return null;
    }
  }, [name, title, showTooltip]);
  const onClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      clickTrackedRef.current = true;
      trackEvent({
        event: GoogleAnalyticsEvents.SOCIAL_CLICK,
        socialName: name,
        linkText: title,
        linkUrl: url,
      });

      if (name === SocialNames.EMAIL) {
        const email = url.replace('mailto:', '');
        const copied = copyTextToClipboard(email);

        if (copied) {
          e.preventDefault();
          clearTimeout(getRefValue(timeoutRef));
          setShowTooltip(true);
        }
      }
    },
    [name, title, url]
  );
  const onMouseLeave = useCallback(() => {
    if (!getRefValue(clickTrackedRef)) {
      trackEvent({
        event: GoogleAnalyticsEvents.SOCIAL_HOVER,
        socialName: name,
        hoverText: title,
        hoverUrl: url,
      });
    }

    timeoutRef.current = window.setTimeout(() => setShowTooltip(false), 200);
  }, [name, title, url]);

  return (
    <li className="footer-social-item">
      <a
        href={url}
        target={target}
        rel="noopener noreferrer nofollow"
        onClick={onClick}
        onMouseLeave={onMouseLeave}
      >
        {icon}
      </a>
    </li>
  );
}

export default FooterSocialItem;
