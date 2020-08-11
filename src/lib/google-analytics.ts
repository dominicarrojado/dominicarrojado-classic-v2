import { isLocalhost } from '../serviceWorker';

declare global {
  interface Window {
    gtag: (type: string, action: string, data: GTagData) => void;
  }
}

interface Event {
  action: string;
  category: string;
  label: string;
  nonInteraction?: boolean;
}

interface GTagData {
  event_category: string;
  event_label: string;
  non_interaction: boolean;
}

export function trackEvent(data: Event) {
  if (typeof window.gtag !== 'function' || isLocalhost) {
    return;
  }

  window.gtag('event', data.action, {
    event_category: data.category,
    event_label: data.label,
    non_interaction: data.nonInteraction ? true : false,
  });
}

export function trackOutboundLink(e: { currentTarget: { href: string } }) {
  trackEvent({
    action: 'click',
    category: 'outbound_link',
    label: e.currentTarget.href,
  });
}

export function trackHover(label: string) {
  trackEvent({
    label,
    action: 'hover',
    category: 'user_interaction',
  });
}
