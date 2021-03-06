const { hash } = require('../utils');
const Interaction = require('./_interaction');

class Group {
  constructor(name, fn) {
    this.id = hash(name);
    this.name = name;
    this.fn = fn;

    this.children = [];

    this.hooks = {
      before: [],
      beforeEach: [],
      after: [],
      afterEach: [],
    };
  }

  bindGlobals() {
    global.group = (name, fn) => this.addChild(Group.create(name, fn));
    global.interaction = (name, fn) => this.addChild(Interaction.create(name, fn));

    Object.keys(this.hooks)
      .forEach(hookType => global[hookType] = fn => this.addHook(hookType, fn));
  }

  async execute() {
    this.bindGlobals();

    await Promise.resolve(this.fn.apply(this.fn, []));

    const beforeHookResults = await this._executeHooks(this.hooks.before);

    await this.children.reduce(
      (promiseChain, child) => promiseChain.then(() => this._executeChild(child, { beforeHookResults })),
      Promise.resolve()
    );

    await this._executeHooks(this.hooks.after);
  }

  async _executeChild(child, { beforeHookResults }) {
    const beforeEachHookResults = await this._executeHooks(this.hooks.beforeEach);

    await child.execute({ hookResults: { before: beforeHookResults, beforeEach: beforeEachHookResults } });

    await this._executeHooks(this.hooks.afterEach);
  }

  getMeasurements() {
    const measurements = this.children.map(c => ({
      id: c.id,
      name: c.name,
      type: 'group',
      measurements: c.getMeasurements(),
    }));

    return measurements;
  }

  async _executeHooks(hooks) {
    const results = await hooks.reduce(async (promiseChain, hook) => {
      const acc = await promiseChain;

      const result = await Promise.resolve(hook.apply(hook, []));
      acc.push(result);

      return acc;
    }, Promise.resolve([]));

    return results;
  }

  addChild(child) {
    this.children.push(child);
  }

  addHook(type, fn) {
    this.hooks[type].push(fn);
  }
}

module.exports = Group;
module.exports.create = (...options) => new Group(...options);
