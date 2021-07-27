const Gecko = require('./lib/gecko');

function getOptions(parameters) {
  const defaultOptions = {
    bindGlobal: true,
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

module.exports.GeckoPerf = Gecko;
