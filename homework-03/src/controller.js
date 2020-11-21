const fs = require('fs');
const path = require('path');

const products = require('../products.json');
const { setDiscountAsync, setDiscountPromise, setDiscountCallback } = require('../task/discount');

let store = require('../products.json');

const home = response => {
  response.end(`Home 🏠`);
};

const notFound = response => {
  response.statusCode = 404;
  response.end('Not Found :(');
};

const writeNewDataToJSON = async (data, response) => {
  try {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    fs.writeFileSync(path.resolve('./', 'products.json'), JSON.stringify(data));
    await response.write(JSON.stringify({ message: `Done. Check products.json`, data }));
    response.end();
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};

const blackFridayAsync = async response => {
  try {
    store = await setDiscountAsync(products);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(store));
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};

const blackFridayPromise = async response => {
  try {
    store = await setDiscountPromise(products);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(store));
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};

const blackFridayCallback = async response => {
  try {
    store = await setDiscountCallback(products);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(store));
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};

module.exports = {
  home,
  notFound,
  writeNewDataToJSON,
  blackFridayAsync,
  blackFridayCallback,
  blackFridayPromise,
};
