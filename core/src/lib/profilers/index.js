const TimeProfiler = require('./_time.profiler');

const customProfilers = [];

module.exports = {
  time: TimeProfiler.create(),
  custom: customProfilers,
};

module.exports.addCustomProfiler = p => customProfilers.push(p);
module.exports.initProfilers = async () => {
  await Promise.all(customProfilers.map(p => p.init()));
};
