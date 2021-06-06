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
  gifLoadTime?: number;
  gifCancelTime?: number;
  gifCancelProgress?: number;
}

interface GTagData {
  event_category: string;
  event_label: string;
  non_interaction: boolean;
  gif_load_time?: number;
  gif_cancel_time?: number;
  gif_cancel_progress?: number;
}

export function trackEvent(data: Event, forced?: boolean) {
  if (typeof window.gtag !== 'function' || (isLocalhost && !forced)) {
    return;
  }

  window.gtag('event', data.action, {
    event_category: data.category,
    event_label: data.label,
    non_interaction: data.nonInteraction ? true : false,
    gif_load_time: data.gifLoadTime,
    gif_cancel_time: data.gifCancelTime,
    gif_cancel_progress: data.gifCancelProgress,
  });
}

export function trackOutboundLink(
  e: { currentTarget: { href: string } },
  forced?: boolean
) {
  trackEvent(
    {
      action: 'click',
      category: 'outbound_link',
      label: e.currentTarget.href,
    },
    forced
  );
}

export function trackHover(label: string, forced?: boolean) {
  trackEvent(
    {
      label,
      action: 'hover',
      category: 'user_interaction',
    },
    forced
  );
}
