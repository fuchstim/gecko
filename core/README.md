# 🦎 GeckoPerf Performance Testing Framework
## Gecko is a framework that simplifies continuous performance testing

### Please note that Gecko is still in its very early stages, updates might introduce breaking changes. Gecko is not recommended for production use.

### Installation
To use Gecko in your project, simply install it using npm:
`npm install --save-dev @geckoperf/core`

### Usage
Using Gecko is straightforward:

```javascript
const PostgresProfiler = require('@geckoperf/profiler-postgres');

const gecko = require('@geckoperf/core')({ 
  customProfilers: [
    PostgresProfiler.create({
      user: 'username',
      password: 'password',
      host: 'localhost',
      database: 'test-database',
      port: 5432,
    }),
  ],
  ...options,
});

group('my application' () => {
  group('test service A', () => {
    before(() => {
      // This will be run once before all interactions in this group
    });

    beforeEach(() => {
      // This will be run before every interaction in this group
    });

    after(() => {
      // This will be run once after all interactions in this group
    });

    afterEach(() => {
      // This will be run after every interaction in this group
    });

    interaction('user interaction A', ({ hookResults }) => {
      // hookResults contains return values of before and beforeEach hooks
      // Simulate user interaction
    });

    interaction('user interaction B', () => {
      // Simulate another user interaction
    });
  });
});

gecko.run()
  .then(results => {
    // Do something with the results of the performance tests
  });
```

If you want to break up your groups into different files, you can use `gecko.loadFile(path)` and `gecko.loadDirectory(path)` to import files into your test suite:

```javascript
  const gecko = require('@geckoperf/core')();

  gecko.loadFile('./service-a.js');
  gecko.loadDirectory('./service-tests');

  gecko.run()
    .then(results => {
      // Handle results
    });
```

#### Gecko Initialisation Options:
`customProfilers`: Array of custom profilers

#### Using `group`s
Usage: `group(name: string, fn: function | async function)`
There are no parameters passed to `fn` on execution.

#### Using `interaction`s
Usage: `interaction(name: string, fn: function | async function)`
On execution, `fn` is passed the following parameters:
```javascript
function fn({ 
  hookResults: {
    before: [ ...(Results of all before hooks, in the same order as hooks were defined) ],
    beforeEach: [ ...(Results of all beforeEach hooks, in the same order as hooks were defined) ],
  }
}) { }
```

#### Using Gecko results
Usage: `const results = await gecko.run();`
The `results` object is a tree that contains all measurements from the executed group / interactions. For the example code above, it looks as follows:
```json
[
  {
    id: '1234',
    name: 'my application',
    type: 'group',
    measurements: [
      {
        id: '5678',
        name: 'test service A',
        type: 'group',
        measurements: [
          {
            id: '90987',
            name: 'user interaction A',
            type: 'interaction',
            measurements: [
              {
                name: 'Time',
                unit: 'ns',
                value: 123456,
              },
              ...(additional measurements),
            ],
          },
          {
            id: '90987',
            name: 'user interaction B',
            type: 'interaction',
            measurements: [
              {
                name: 'Time',
                unit: 'ns',
                value: 123456,
              },
              ...(additional measurements),
            ],
          },
        ],
      },
    ],
  },
]
```

### Creating a custom profiler
Creating a custom profiler for Gecko is simple:

```javascript
const { Profiler } = require('@geckoperf/core');

class CustomProfiler extends Profiler {
  constructor() {
    super(name: string); // Define the name of your custom profiler
  }

  // Implementing init() is optional
  // init() can be async
  init() {
    // Initialise your profiler
  }

  // Implementing start() is mandatory
  // start() can be async
  start() {
    // Start measurement
  }

  // Implementing stop() is mandatory
  // stop() can be async
  stop() {
    // Stop measurement

    return super.result(result: any, unit: string);
  }
}
```
