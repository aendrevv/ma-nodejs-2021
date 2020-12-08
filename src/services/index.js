const task1 = require('./task1');
const task2 = require('./task2');
const task3 = require('./task3');
const myMap = require('./myMap');
const { setDiscountAsync, setDiscountPromise, setDiscountCallback } = require('./discount');
const { createCsvToJson } = require('./csvToJson');
const { jsonOptimizer } = require('./jsonOptimizer');

module.exports = {
  task1,
  task2,
  task3,
  myMap,
  setDiscountAsync,
  setDiscountPromise,
  setDiscountCallback,
  createCsvToJson,
  jsonOptimizer,
};
