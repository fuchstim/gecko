const Profiler = require('./profiler.class');

class TimeProfiler extends Profiler {
  constructor(startTime) {
    super('Time');

    this.startTime = startTime;
    this.stopTime = null;
  }

  start() {
    return new TimeProfiler(process.hrtime.bigint());
  }

  lap() {
    const lapTime = process.hrtime.bigint();

    if (!this.startTime) { return 0; }

    return super.result(Number(lapTime - this.startTime), 'ns');
  }

  stop() {
    const stopTime = process.hrtime.bigint();

    if (!this.startTime) { return 0; }
    if (!this.stopTime) { this.stopTime = stopTime; }

    return super.result(Number(this.stopTime - this.startTime), 'ns');
  }
}

module.exports = TimeProfiler;
module.exports.create = () => new TimeProfiler();
