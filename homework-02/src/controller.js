const fs = require('fs');
const path = require('path');

const { task1: task01, task2: task02, task3: task03 } = require('../task');
const products = require('../products.json');

let store = {};

const isJsonString = str => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

const home = response => {
  response.end(`Home 🏠`);
};

const notFound = response => {
  response.statusCode = 404;
  response.end('Not Found :(');
};

const teapot = response => {
  response.statusCode = 418;
  response.write(`U know what it means xD`);
  response.end();
};

const task1 = async (response, queryParams) => {
  try {
    const result = task01(products, queryParams.field, queryParams.value);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(result));
    response.end();
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};

const task2 = async response => {
  try {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(task02(products)));
    response.end();
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};

const task3 = async response => {
  try {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(task03(products)));
    response.end();
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};

const writeNewDataToVariable = async (data, response) => {
  try {
    store = data;
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(store));
    response.end();
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};

const writeNewDataToJSON = async (data, response) => {
  try {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    if (isJsonString(data)) {
      fs.writeFileSync(path.resolve('./', 'products.json'), JSON.stringify(data));
    }
    await response.write(JSON.stringify({ message: `Done. Check products.json`, data }));
    response.end();
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};

module.exports = {
  home,
  notFound,
  teapot,
  task1,
  task2,
  task3,
  writeNewDataToVariable,
  writeNewDataToJSON,
};
