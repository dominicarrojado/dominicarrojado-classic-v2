import { trackEvent, trackOutboundLink, trackHover } from '../google-analytics';

const event = {
  action: 'gif_auto_play_start',
  category: 'gif_auto_play',
  label: `Downloaded GIF - Razer Chroma Studio`,
  value: '100%',
  nonInteraction: true,
};

describe('google-analytics utils', () => {
  beforeEach(() => {
    window.gtag = jest.fn();
  });

  describe('trackEvent()', () => {
    it('will not track event on local development', () => {
      trackEvent(event);

      expect(window.gtag).toBeCalledTimes(0);
    });

    it('can track event', () => {
      trackEvent(event, true);

      expect(window.gtag).toBeCalledWith('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction,
      });
    });
  });

  describe('trackOutboundLink()', () => {
    it('can track outbound link', () => {
      const href = 'https://wwww.example.com';

      trackOutboundLink({ currentTarget: { href } }, true);

      expect(window.gtag).toBeCalledWith('event', 'click', {
        event_category: 'outbound_link',
        event_label: href,
        non_interaction: false,
      });
    });
  });

  describe('trackHover', () => {
    it('can track hover event', () => {
      const label = 'Best Project - Razer Chroma Studio';

      trackHover(label, true);

      expect(window.gtag).toBeCalledWith('event', 'hover', {
        event_category: 'user_interaction',
        event_label: label,
        non_interaction: false,
      });
    });
  });
});
