# log-server

A generic server that starts, logs via POST into database, can process and serve logs, and can be stopped

## Problem

Gathering data from a running application or script and processing the outcome afterwards.

## Solution

Use LokiJS as an in-memory document database to store log entries. Create a REST api that allows resetting the entries, adding a new entry and processing the entries. Make the server generic, allowing for entry points to configure how the data is stored in the database and how the result is produced.

## Installation

```sh
yarn
```

or

```sh
npm install
```

## Usage

### 1. Starting the server

#### With key / value mocks

```sh
node index.js
```

#### With implementation

```sh
node index.js -f ./path/to/implementation.js
```

### 2. Logging

1. First start the service (automatically starts when running) to clear existing entries.

```sh
curl -X POST \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
'http://127.0.0.1:3000/log-start'
```

2. Log your entries

```sh
curl -X POST \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
-d '{"component":"MarkdownComponent", "page": "Welcome", "time": 1000}' \
'http://127.0.0.1:3000/log'
```

3. Produce final report

```sh
curl -X POST \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
'http://127.0.0.1:3000/log-end'
```

### 3. Custom implementations

Custom implementations need to define 3 functions:

- `key`: `(requestBody: object) => string;`
- `value`: `(requestBody: object) => string | object;`
- `produce`: `(cacheObject: object) => string | object;`

#### Example

```js
function key(body) {
  const { component, page } = body;
  return [page, component].join(".");
}

function value(body) {
  const { time } = body;
  return time;
}

function produce(cache) {
  return Object.entries(cache).reduce(reducePages, {});
}

function reducePages(accum, [page, componentsObj]) {
  return {
    ...accum,
    [page]: Object.entries(componentsObj).reduce(reduceComponents, {})
  };
}

function reduceComponents(componentsAccum, [component, times]) {
  return {
    ...componentsAccum,
    [component]: {
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      _count: times.length
    }
  };
}

module.exports = { key, value, produce };
```

**NOTE: the `cacheObject` in the produce function is an object whose shape will be determined by the entries' keys** (see [entriesToObject](https://github.com/GonchuB/log-server/blob/master/src/db.helpers.js))

```js
// entriesToObject example

const entries = [
  { key: "a.b", value: 1 },
  { key: "a.b", value: 2 },
  { key: "a.c", value: 3 }
];

// groupBy(entries, "key") + 🍫

return { a: { b: [1, 2], c: [3] } }; // cacheObject
```

## Inspiration

[How to use React's experimental new profiler feature](https://medium.com/@dave_lunny/how-to-use-reacts-experimental-new-profiler-feature-c340674e5d0e)

Using [profile implementation](https://github.com/GonchuB/log-server/blob/master/impls/profiler.js).

```js
// withAsyncBenchmark.js
import React from "react";

function withAsyncBenchmark(WrappedComponent, id = "BenchmarkComponent") {
  const Profiler = React.unstable_Profiler;

  const LOG_SERVER_URL = "https://127.0.0.1:3000/log";
  const LOG_SERVER_METHOD = "POST";
  const LOG_SERVER_HEADERS = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  function onRender(component, mode, actualTime) {
    fetch(LOG_SERVER_URL, {
      body: JSON.stringify({ component, mode, value: actualTime }),
      method: LOG_SERVER_METHOD,
      headers: LOG_SERVER_HEADERS
    });
  }

  return function WithProfiler(props) {
    return (
      <Profiler id={id} onRender={onRender}>
        <WrappedComponent {...props} />
      </Profiler>
    );
  };
}
```

```js
// ./Page.js
import withAsyncBenchmark from "./withAsyncBenchmark";
import ComponentToBenchmark from "./Page.component";

export default withAsyncBenchmark(ComponentToBenchmark, "Page");
```

```js
// Sample payload send to log-server via `onRender` function
{ component: 'Page', mode: 'mount', value: 12.210000189952552 }
```

```js
// Sample aggregation of entries
{
  Page: {
    mount: {
      avg: 0.1593013390228786,
      max: 1.4900000533089042,
      min: 0.054999953135848045,
      _count: 823
    }
  }
}
```

## License

[MIT Licence](https://github.com/GonchuB/log-server/blob/master/LICENSE) (c) Gonzalo Beviglia
