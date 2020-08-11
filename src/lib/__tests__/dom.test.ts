import 'jest';
import { copyTextToClipboard } from '../dom';

describe('dom', () => {
  beforeEach(() => {
    document.execCommand = jest.fn();
  });

  it('can copy text to clipboard', () => {
    copyTextToClipboard('Hello World');
    expect(document.execCommand).toBeCalledWith('copy');
  });
});
