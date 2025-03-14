import BaseManager from './base.manager.js';

// intervals의 구조
// { userId: { type1: setInterval1, type2: setInterval2, ... } }

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.intervals = new Map();
  }

  addPlayer(userId, callback, interval, type = 'user') {
    if (!this.intervals.has(userId)) {
      this.intervals.set(userId, new Map());
    }
    this.intervals.get(userId).set(type, setInterval(callback, interval));
  }

  checkPong(userId, callback, interval) {
    this.addPlayer(userId, callback, interval, 'checkPong');
  }

  removePlayer(userId) {
    if (this.intervals.has(userId)) {
      const userIntervals = this.intervals.get(userId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      this.intervals.delete(userId);
    }
  }

  removeInterval(userId, type) {
    if (this.intervals.has(userId)) {
      const userIntervals = this.intervals.get(userId);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
    });
    this.intervals.clear();
  }
}

export default IntervalManager;
