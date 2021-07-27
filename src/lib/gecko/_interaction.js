const { hash } = require('../utils');

class Interaction {
  constructor(name, fn) {
    this.id = hash(name);
    this.name = name;
    this.fn = fn;
  }

  async execute({ hookResults }) {
    // start measurement

    await Promise.resolve(this.fn.apply(this.fn, [{ hookResults }]));

    // stop measurement
  }
}

module.exports = Interaction;
module.exports.create = (...options) => new Interaction(...options);
