const Group = require('./_group');
const { initProfilers, addCustomProfiler } = require('../profilers');

class Gecko {
  constructor(options) {
    this._setupCustomProfilers(options.customProfilers);

    this.rootGroup = Group.create('🦎', () => {});

    this.rootGroup.bindGlobals();
  }

  _setupCustomProfilers(customProfilers) {
    customProfilers.forEach(p => addCustomProfiler(p));
  }

  async run() {
    await initProfilers();

    await this.rootGroup.execute();

    const measurements = this.rootGroup.getMeasurements();

    return measurements;
  }
}

module.exports = Gecko;
module.exports.create = options => new Gecko(options);
