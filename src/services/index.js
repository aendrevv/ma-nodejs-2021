const { whichIsMostExpensive, filterByTypeAndValue, arrayModifier } = require('./tasks');
const myMap = require('./myMap');
const { setDiscountAsync, setDiscountPromise, setDiscountCallback } = require('./discount');
const { createCsvToJson } = require('./csvToJson');
const { jsonOptimizer, jsontodb, createNewInDB } = require('./jsonHandlers');

module.exports = {
  whichIsMostExpensive,
  filterByTypeAndValue,
  arrayModifier,
  myMap,
  setDiscountAsync,
  setDiscountPromise,
  setDiscountCallback,
  createCsvToJson,
  jsonOptimizer,
  jsontodb,
  createNewInDB,
};
