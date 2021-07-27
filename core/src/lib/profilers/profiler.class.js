const Measurement = require('./measurement.class');

class Profiler {
  constructor(name) {
    this.name = name;
  }

  start() {
    throw new Error('Profiler.start() must be implemented!');
  }

  stop() {
    throw new Error('Profiler.stop() must be implemented!');
  }

  result(value, unit) {
    return Measurement.create({ name: this.name, value, unit });
  }
}

module.exports = Profiler;
