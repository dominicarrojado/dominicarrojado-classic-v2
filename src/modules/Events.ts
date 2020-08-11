interface Callback {
  (payload?: any): void;
}

class Events {
  events: { [k: string]: [Callback] };

  constructor() {
    this.events = {};
  }

  on = (event: string, callback: Callback) => {
    if (this.events[event]) {
      this.events[event].push(callback);
    } else {
      this.events[event] = [callback];
    }
  };

  off = (event: string, callback: Callback) => {
    if (!this.events[event]) {
      return;
    }

    const index = this.events[event].indexOf(callback);

    if (index !== -1) {
      this.events[event].splice(index, 1);
    }
  };

  emit = (event: string, payload?: any) => {
    if (!this.events[event]) {
      return;
    }

    this.events[event].forEach((callback) => {
      if (typeof callback === 'function') {
        callback(payload);
      }
    });
  };
}

export default Events;
