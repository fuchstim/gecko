const assert = require('assert');
const sinon = require('sinon');

const Gecko = require('../src');

describe('interactions', () => {
  it('registers and executes an interaction with name and function', async () => {
    const g = Gecko();

    const interactionName = 'test interaction';
    const spy = sinon.spy();
    interaction(interactionName, spy);

    await g.run();

    assert.ok(spy.calledOnce);
    assert.strictEqual(g.rootGroup.children.length, 1);
    assert.strictEqual(g.rootGroup.children[0].name, interactionName);
    assert.strictEqual(g.rootGroup.children[0].fn, spy);
  });

  it('registers and executes an async interaction', async () => {
    const g = Gecko();

    const interactionName = 'test interaction';
    const spy = sinon.spy();
    interaction(interactionName, () => new Promise(r => setTimeout(r, 10)).then(spy));

    await g.run();

    assert.ok(spy.calledOnce);
    assert.strictEqual(g.rootGroup.children.length, 1);
    assert.strictEqual(g.rootGroup.children[0].name, interactionName);
  });

  it('registers and executes multiple interactions with names and functions', async () => {
    const g = Gecko();

    const interactionNames = [];

    const interactionCount = 10;
    for (let i = 0; i < interactionCount; i ++) {
      const interactionName = `test interaction ${i}`;
      const fn = sinon.spy();
      interaction(interactionName, fn);

      interactionNames.push(interactionName);
    }

    await g.run();

    assert.strictEqual(g.rootGroup.children.length, interactionCount);
    interactionNames.forEach(interactionName => {
      assert.strictEqual(g.rootGroup.children.filter(({ name }) => name === interactionName).length, 1);
      assert.ok(g.rootGroup.children.find(({ name }) => name === interactionName).fn.calledOnce);
    });
  });
});

