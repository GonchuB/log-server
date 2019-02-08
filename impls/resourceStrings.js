function key(body) {
  const { key, url } = body;

  return [url, key].join(".");
}

function value(body) {
  return body.value;
}

function produce(cache) {
  return Object.entries(cache).reduce(
    (accum, [url, stringsObj]) => ({
      ...accum,
      [url]: Object.entries(stringsObj).reduce(
        (stringsAccum, [stringKey, values]) => ({
          ...stringsAccum,
          [stringKey]: values[0]
        }),
        {}
      )
    }),
    {}
  );
}

module.exports = { key, value, produce };
