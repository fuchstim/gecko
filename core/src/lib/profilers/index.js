const TimeProfiler = require('./_time.profiler');

const customProfilers = [];

module.exports = {
  time: TimeProfiler.create(),
  custom: customProfilers,
};

module.exports.addCustomProfiler = p => this.customProfilers.push(p);
