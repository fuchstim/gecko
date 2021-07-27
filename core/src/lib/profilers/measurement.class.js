class Measurement {
  constructor({ name, value, unit }) {
    this.name = name;
    this.unit = unit;
    this.value = value;
  }
}

module.exports = Measurement;
module.exports.create = (...options) => new Measurement(...options);
