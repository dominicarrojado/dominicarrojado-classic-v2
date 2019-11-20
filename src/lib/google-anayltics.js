export function trackOutboundLink(e) {
  if (
    typeof window.gtag !== 'function' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return;
  }

  window.gtag('event', 'click', {
    event_category: 'outbound_link',
    event_label: e.currentTarget.href,
  });
}
