const fs = require('fs');
const path = require('path');

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

  loadFile(filePath) {
    require(path.resolve(filePath));
  }

  loadDirectory(path) {
    const files = this._listFiles(path);

    files.forEach(require);
  }

  _listFiles(path) {
    const files = fs.readdirSync(path);

    const results = [];
    files.forEach(file => {
      if (fs.statSync(path.resolve(path, file)).isDirectory()) {
        results.push(...this._listFiles(path.resolve(path, file)));
      } else {
        results.push(path.resolve(path, file));
      }
    });

    return results;
  }
}

module.exports = Gecko;
module.exports.create = options => new Gecko(options);
