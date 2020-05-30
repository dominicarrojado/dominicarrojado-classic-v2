import { isLocalhost } from '../serviceWorker';

export function trackOutboundLink(e) {
  if (typeof window.gtag !== 'function' || isLocalhost) {
    return;
  }

  window.gtag('event', 'click', {
    event_category: 'outbound_link',
    event_label: e.currentTarget.href,
  });
}
