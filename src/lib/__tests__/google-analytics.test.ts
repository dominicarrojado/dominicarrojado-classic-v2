import { trackEvent, trackOutboundLink, trackHover } from '../google-analytics';

const event = {
  action: 'gif_auto_play_start',
  category: 'gif_auto_play',
  label: `Downloaded GIF - Razer Chroma Studio`,
  nonInteraction: true,
};

describe('google-analytics utils', () => {
  const gtagOrig = window.gtag;

  beforeEach(() => {
    window.gtag = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.gtag = gtagOrig;
  });

  describe('trackEvent()', () => {
    it('will not track event on local development', () => {
      const gtagSpy = jest.spyOn(window, 'gtag');

      trackEvent(event);

      expect(gtagSpy).toBeCalledTimes(0);
    });

    it('can track event', () => {
      const gtagSpy = jest.spyOn(window, 'gtag');

      trackEvent(event, true);

      expect(gtagSpy).toBeCalledWith('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        non_interaction: event.nonInteraction,
      });
    });

    it('can track gif load time', () => {
      const gtagSpy = jest.spyOn(window, 'gtag');
      const gifLoadTime = 4000;

      trackEvent({ ...event, gifLoadTime }, true);

      expect(gtagSpy).toBeCalledWith('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        non_interaction: event.nonInteraction,
        gif_load_time: gifLoadTime,
      });
    });

    it('can track gif cancel metrics', () => {
      const gtagSpy = jest.spyOn(window, 'gtag');
      const metrics = {
        gifCancelTime: 1000,
        gifCancelProgress: 25,
      };

      trackEvent({ ...event, ...metrics }, true);

      expect(gtagSpy).toBeCalledWith('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        non_interaction: event.nonInteraction,
        gif_cancel_time: metrics.gifCancelTime,
        gif_cancel_progress: metrics.gifCancelProgress,
      });
    });
  });

  describe('trackOutboundLink()', () => {
    it('can track outbound link', () => {
      const gtagSpy = jest.spyOn(window, 'gtag');
      const href = 'https://wwww.example.com';

      trackOutboundLink({ currentTarget: { href } }, true);

      expect(gtagSpy).toBeCalledWith('event', 'click', {
        event_category: 'outbound_link',
        event_label: href,
        non_interaction: false,
      });
    });
  });

  describe('trackHover', () => {
    it('can track hover event', () => {
      const gtagSpy = jest.spyOn(window, 'gtag');
      const label = 'Best Project - Razer Chroma Studio';

      trackHover(label, true);

      expect(gtagSpy).toBeCalledWith('event', 'hover', {
        event_category: 'user_interaction',
        event_label: label,
        non_interaction: false,
      });
    });
  });
});
