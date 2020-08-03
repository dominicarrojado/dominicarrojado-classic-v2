import Events from '../Events';

describe('Events', () => {
  it('can store events', () => {
    const events = new Events();
    const event = 'test';
    const callback = jest.fn();

    events.on(event, callback);

    expect(events.events[event]).toEqual([callback]);
  });

  it('can remove events', () => {
    const events = new Events();
    const event = 'test';
    const callback = jest.fn();
    const callback2 = jest.fn();

    events.on(event, callback);
    events.on(event, callback2);
    events.off(event, callback);
    events.emit(event);

    expect(events.events[event]).toEqual([callback2]);
    expect(callback).toBeCalledTimes(0);
  });

  it('can emit events', () => {
    const events = new Events();
    const event = 'test';
    const event2 = 'test2';
    const callback = jest.fn();
    const callback2 = jest.fn();

    events.on(event, callback);
    events.on(event, callback);
    events.on(event2, callback2);
    events.emit(event);
    events.emit(event2);

    expect(callback).toBeCalledTimes(2);
    expect(callback2).toBeCalledTimes(1);
  });
});
