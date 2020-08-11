import 'jest';
import { getPublicURL } from '../common';

describe('common', () => {
  it('can get the public URL of an asset', () => {
    const url = '/works/sample.png';

    expect(getPublicURL(url)).toContain(url);
  });
});
