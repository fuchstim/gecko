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

  get groups() { return this.children.filter(c => typeof child === Group); }
  get interactions() { return this.children.filter(c => typeof child === Interaction); }

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

    await this.children.reduce(async (promiseChain, child) => {
      await promiseChain;

      const beforeEachHookResults = await this._executeHooks(this.hooks.beforeEach);

      await child.execute({ hookResults: { before: beforeHookResults, beforeEach: beforeEachHookResults } });

      await this._executeHooks(this.hooks.afterEach);
    }, Promise.resolve());

    await this._executeHooks(this.hooks.after);
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
