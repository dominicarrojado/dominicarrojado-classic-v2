export function trackOutboundLink(e) {
  if (typeof window.ga !== 'function') {
    return;
  }

  window.ga('send', 'event', {
    eventCategory: 'Outbound Link',
    eventAction: 'click',
    eventLabel: e.currentTarget.href,
    transport: 'beacon',
  });
}
