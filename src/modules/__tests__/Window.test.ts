import Window from '../Window';

describe('Window', () => {
  it('can initialize', () => {
    Window.init();

    expect(Window.loaded).toBe(true);
  });
});
