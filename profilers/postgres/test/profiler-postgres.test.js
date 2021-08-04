const assert = require('assert');

const PostgresProfiler = require('../index');

describe('@geckoperf/profiler-postgres', () => {
  it('initialises the profiler using explicit connection options', () => {
    const options = {
      user: 'testUser',
      host: 'testHost',
      database: 'testDatabase',
      password: 'testPassword',
      port: 1234,
    };
    const profiler = new PostgresProfiler(options);

    Object.keys(options).forEach(k => assert.strictEqual(options[k], profiler.client[k]));
  });

  it('initialises the profiler using a connection string', () => {
    const options = {
      user: 'testUser',
      host: 'testHost',
      database: 'testDatabase',
      password: 'testPassword',
      port: 1234,
    };
    const profiler = new PostgresProfiler({
      url: `postgresql://${options.user}:${options.password}@${options.host}:${options.port}/${options.database}`,
    });

    Object.keys(options).forEach(k => assert.strictEqual(options[k], profiler.client[k]));
  });
});
