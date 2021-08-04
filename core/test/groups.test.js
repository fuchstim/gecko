const assert = require('assert');
const sinon = require('sinon');

const Gecko = require('../src');

describe('groups', () => {
  it('registers and executes a group with name and function', async () => {
    const g = Gecko();

    const groupName = 'test group';
    const spy = sinon.spy();
    group(groupName, spy);

    await g.run();

    assert.ok(spy.calledOnce);
    assert.strictEqual(g.rootGroup.children.length, 1);
    assert.strictEqual(g.rootGroup.children[0].name, groupName);
    assert.strictEqual(g.rootGroup.children[0].fn, spy);
  });

  it('registers and executes multiple groups with names and functions', async () => {
    const g = Gecko();

    const groupNames = [];

    const groupCount = 10;
    for (let i = 0; i < groupCount; i ++) {
      const groupName = `test group ${i}`;
      const fn = sinon.spy();
      group(groupName, fn);

      groupNames.push(groupName);
    }

    await g.run();

    assert.strictEqual(g.rootGroup.children.length, groupCount);
    groupNames.forEach(groupName => {
      assert.strictEqual(g.rootGroup.children.filter(({ name }) => name === groupName).length, 1);
      assert.ok(g.rootGroup.children.find(({ name }) => name === groupName).fn.calledOnce);
    });
  });

  it('registers and executes nested groups with names and functions', async () => {
    const g = Gecko();

    const spies = [
      sinon.spy(),
      sinon.spy(),
      sinon.spy(),
      sinon.spy(),
    ];

    group('parent group', () => {
      spies[0]();
      group('child group 1', () => {
        spies[1]();
        group('child group 2', () => {
          spies[2]();
          group('child group 3', spies[3]);
        });
      });
    });

    await g.run();

    spies.forEach(s => assert.ok(s.calledOnce));

    assert.strictEqual(g.rootGroup.children[0].name, 'parent group');
    assert.strictEqual(g.rootGroup.children[0].children[0].name, 'child group 1');
    assert.strictEqual(g.rootGroup.children[0].children[0].children[0].name, 'child group 2');
    assert.strictEqual(g.rootGroup.children[0].children[0].children[0].children[0].name, 'child group 3');
    assert.strictEqual(g.rootGroup.children[0].children[0].children[0].children[0].children.length, 0);
  });
});

