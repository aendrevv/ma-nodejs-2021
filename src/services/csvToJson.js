const { Transform } = require('stream');

const createCsvToJson = () => {
  let first = true;
  let data;
  let last = '';
  const transform = (chunk, encoding, callback) => {
    let result = ',\n';
    let products = chunk.toString().split('\n');

    if (first) {
      data = products.shift().split(',');
      result = `[\n`;
      first = false;
    }

    products.unshift(...(last + products.shift()).split('\n'));
    last = products.pop();

    products = products.map(stringa => {
      const value = stringa.split(`,`);
      return `{"${data[0]}": "${value[0]}", "${data[1]}": "${value[1]}", "${data[2]}": "${value[2]}", "${data[3]}": "${value[3]}"}`;
    });

    if (products.length > 0) result += products.join(',\n');
    else result = '';

    callback(null, result);
  };

  const flush = callback => {
    console.log(`No more data to read`);
    callback(null, `\n]`);
  };

  return new Transform({ transform, flush });
};

module.exports = { createCsvToJson };
