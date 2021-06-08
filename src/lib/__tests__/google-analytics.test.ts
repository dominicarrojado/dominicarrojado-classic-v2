import { GoogleAnalyticsEvents } from '../../types';
import { trackEvent } from '../google-analytics';

const event = {
  event: GoogleAnalyticsEvents.SCROLL_CLICK,
  linkText: 'Scroll Down',
} as const;

describe('google-analytics utils', () => {
  describe('trackEvent()', () => {
    const dataLayerOrig = window.dataLayer;

    beforeEach(() => {
      delete window.dataLayer;
    });

    afterEach(() => {
      window.dataLayer = dataLayerOrig;
    });

    it("shouldn't not track event on local development", () => {
      trackEvent(event);

      expect(window.dataLayer).toBeUndefined();
    });

    it('can track event (dataLayer is undefined)', () => {
      trackEvent(event, true);

      expect(window.dataLayer).toEqual([event]);
    });

    it('can track event (dataLayer is defined)', () => {
      const currentDataLayer = [
        {
          event: 'page_view',
        },
      ];

      window.dataLayer = [...currentDataLayer];

      trackEvent(event, true);

      expect(window.dataLayer).toEqual([...currentDataLayer, event]);
    });
  });
});
