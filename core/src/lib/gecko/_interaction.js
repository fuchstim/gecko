const { hash } = require('../utils');

const profilers = require('../profilers');

class Interaction {
  constructor(name, fn) {
    this.id = hash(name);
    this.name = name;
    this.fn = fn;

    this.measurements = [];
  }

  async execute({ hookResults }) {
    profilers.time.start();

    await Promise.all(
      profilers.custom.map(p => Promise.resolve(p.start()))
    );

    await Promise.resolve(this.fn.apply(this.fn, [{ hookResults }]));

    const timeMeasurement = profilers.time.stop();

    const customProfilerMeasurements = await Promise.all(
      profilers.custom.map(p => Promise.resolve(p.stop()))
    );

    this.measurements = [ timeMeasurement, ...customProfilerMeasurements ];
  }

  getMeasurements() {
    return {
      id: this.id,
      name: this.name,
      type: 'interaction',
      measurements: this.measurements,
    };
  }
}

module.exports = Interaction;
module.exports.create = (...options) => new Interaction(...options);
