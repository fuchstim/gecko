const Group = require('./_group');

class Gecko {
  constructor(options) {
    this.measurements = [];

    this.rootGroup = Group.create('🦎', () => {});

    this.rootGroup.bindGlobals();
  }

  get results() {
    return this._formatMeasurements(this.measurements);
  }

  async run() {
    await this.rootGroup.execute();
  }

  _formatMeasurements(measurements) {
    return measurements;
  }

}

module.exports = Gecko;
module.exports.create = options => new Gecko(options);
