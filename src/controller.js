const fs = require('fs');
const path = require('path');

const products = require('../products.json');
const { setDiscountAsync, setDiscountPromise, setDiscountCallback } = require('../task/discount');

let store = [];

const home = response => {
  response.end(`Home 🏠`);
};

const notFound = response => {
  response.statusCode = 404;
  response.end('Not Found :(');
};

const badData = response => {
  console.log(`BAD`);
  response.statusCode = 406;
  response.end(JSON.stringify({ message: `406 Not Acceptable` }));
};

const serverError = response => {
  response.statusCode = 500;
  response.end(JSON.stringify({ message: `500 Internal Server Error` }));
};

const writeNewDataToJSON = (data, response) => {
  if (!Array.isArray(data) || !data.some(e => e.type && e.color && (e.price || e.priceForPair)))
    return badData(response);

  try {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    fs.writeFileSync(path.resolve('./', `products.json`), JSON.stringify(data));
    response.write(JSON.stringify({ message: `Done. Check products.json`, data }));
    return response.end();
  } catch (error) {
    console.error(error.message);
    return serverError(response);
  }
};

const blackFridayAsync = async response => {
  try {
    store = await setDiscountAsync(products);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(store));
    return response.end();
  } catch (error) {
    console.error(error.message);
    return serverError(response);
  }
};

const blackFridayPromise = response => {
  try {
    setDiscountPromise(products).then(storage => {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(storage));
      response.end();
    });

    return;
  } catch (error) {
    console.error(error.message);
    serverError(response);
  }
};

const blackFridayCallback = response => {
  try {
    return setDiscountCallback(products, response, (res, storage) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(storage));
      return res.end();
    });
  } catch (error) {
    console.error(error.message);
    return serverError(response);
  }
  // setDiscountCallback(products, )
};

module.exports = {
  home,
  notFound,
  writeNewDataToJSON,
  blackFridayAsync,
  blackFridayCallback,
  blackFridayPromise,
};
