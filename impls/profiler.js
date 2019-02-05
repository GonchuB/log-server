function key(body) {
  const { component, mode } = body;

  return [component, mode].join(".");
}

function value(body) {
  const { value } = body;

  return value;
}

function produce(cache) {
  return Object.entries(cache).reduce(
    (accum, [component, modesObj]) => ({
      ...accum,
      [component]: Object.entries(modesObj).reduce(
        (modesAccum, [mode, times]) => ({
          ...modesAccum,
          [mode]: {
            avg: times.reduce((a, b) => a + b, 0) / times.length,
            max: Math.max(...times),
            min: Math.min(...times),
            _count: times.length
          }
        }),
        {}
      )
    }),
    {}
  );
}

module.exports = { key, value, produce };
