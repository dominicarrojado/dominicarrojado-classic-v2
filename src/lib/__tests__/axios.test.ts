import 'jest';
import { getImageDataFromResponse } from '../axios';

describe('axios', () => {
  it('can get image data from response', () => {
    const contentType = 'image/gif;charset=utf-8';

    expect(
      getImageDataFromResponse({
        data: 'ArrayBuffer',
        headers: {
          'content-type': contentType,
        },
      })
    ).toContain(`data:${contentType}`);
  });
});
