const { Profiler } = require('@geckoperf/core');

const { Client } = require('pg');

class PostgresProfiler extends Profiler {
  constructor(options = {}) {
    super('Postgres');

    this.client = new Client({
      user: options.user,
      host: options.host,
      database: options.database,
      password: options.password,
      port: options.port,
    });
  }

  async init() {
    await this.client.connect();
    const res = await this.client.query(/* sql */ `
      SELECT * 
      FROM pg_available_extensions 
      WHERE name = 'pg_stat_statements';
    `);

    if (!res?.rows?.[0]?.installed_version) {
      await this.client.query(/* sql */ `
        CREATE EXTENSION pg_stat_statements;
      `);
    }
  }

  async start() {
    await this._reset();

    return {
      stop: () => this.stop(),
    };
  }

  async stop() {
    const res = await this.client.query(/* sql */ `
      SELECT * 
      FROM pg_stat_statements
      WHERE query <> 'SELECT pg_stat_statements_reset()';
    `);

    const result = this._formatResult(res?.rows);

    return super.result(result);
  }

  _formatResult(result = []) {
    return result.map(r => ({
      userId: r.userid,
      dbId: r.dbid,
      queryId: r.queryid,
      query: r.query,
      calls: r.calls,
      totalTime: r.total_time,
      rows: r.rows,
      sharedBlksHit: r.shared_blks_hit,
      sharedBlksRead: r.shared_blks_read,
      sharedBlksDirtied: r.shared_blks_dirtied,
      sharedBlksWritten: r.shared_blks_written,
      localBlksHit: r.local_blks_hit,
      localBlksRead: r.local_blks_read,
      localBlksDirtied: r.local_blks_dirtied,
      localBlksWritten: r.local_blks_written,
      tempBlksRead: r.temp_blks_read,
      tempBlksWritten: r.temp_blks_written,
      blkReadTime: r.blk_read_time,
      blkWriteTime: r.blk_write_time,
    }));
  }

  async _reset() {
    await this.client.query(/* sql */ `
      SELECT pg_stat_statements_reset();
    `);
  }
}

module.exports = PostgresProfiler;
module.exports.create = options => new PostgresProfiler(options);
