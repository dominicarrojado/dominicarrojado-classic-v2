import { isLocalhost } from '../serviceWorker';

export function trackEvent(data) {
  if (typeof window.gtag !== 'function' || isLocalhost) {
    return;
  }

  window.gtag('event', data.action, {
    event_category: data.category,
    event_label: data.label,
    non_interaction: data.nonInteraction ? true : false,
  });
}

export function trackOutboundLink(e) {
  trackEvent({
    action: 'click',
    category: 'outbound_link',
    label: e.currentTarget.href,
  });
}

export function trackHover(label) {
  trackEvent({
    label,
    action: 'hover',
    category: 'user_interaction',
  });
}
