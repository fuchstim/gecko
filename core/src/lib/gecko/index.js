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

  loadDirectory(dirPath) {
    const files = this._listFiles(dirPath);

    files.forEach(require);
  }

  _listFiles(dirPath) {
    const files = fs.readdirSync(dirPath);

    const results = [];
    files.forEach(filePath => {
      if (fs.statSync(path.resolve(dirPath, filePath)).isDirectory()) {
        results.push(...this._listFiles(path.resolve(dirPath, filePath)));
      } else {
        results.push(path.resolve(dirPath, filePath));
      }
    });

    return results;
  }
}

module.exports = Gecko;
module.exports.create = options => new Gecko(options);
