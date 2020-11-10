const { task1: task01, task2: task02, task3 } = require('./task');

const products = require('./products.json');

const boot = (array, type, value) => {
  const result = task01(array, type, value);
  console.log('task1:\n', result);
  console.log('task3:\n', task3(result));
  console.log('task2:\n', task02);
}

boot(products, 'type', 'socks');
