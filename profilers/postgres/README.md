# 🦎 Gecko Postgres Profiler
## The Gecko postgres profiler enables psql performance testing in your Gecko suite
### Installation
To use the Gecko postgres profiler in your suite, install it using npm:
`npm install --save-dev @geckoperf/profiler-postgres`

### Usage

```
const PostgresProfiler = require('@geckoperf/profiler-postgres');

const postgresProfiler = PostgresProfiler.create({
  user: 'username',
  password: 'password',
  host: 'localhost',
  database: 'database',
  port: 5432,
});

const gecko = require('@geckoperf/core')({
  customProfilers: [
    postgresProfiler,
  ],
})
```
