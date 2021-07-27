const Gecko = require('./lib/gecko');
const Profiler = require('./lib/profilers/profiler.class');

function getOptions(parameters) {
  const defaultOptions = {
    customProfilers: [],
  };

  return {
    ...defaultOptions,
    ...parameters,
  };
}

module.exports = parameters => {
  const options = getOptions(parameters);
  const gecko = new Gecko(options);

  return gecko;
};

module.exports.Gecko = Gecko;
module.exports.Profiler = Profiler;
