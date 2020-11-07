const { task1: task01, task2: task02, task3: task03 } = require('../task');
const products = require('../products.json');

function home(response) {
  response.write('Home, sweet home!');
  response.end();
}

function teapot(response) {
  response.writeHead(418, { 'Content-Type': 'application/json' });

  response.end(JSON.stringify({ message: `You know, what it means!)` }));
}

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

const task2 = async (response) => {
  try {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(task02));
    response.end();
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};

const task3 = async (response) => {
  try {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(task03(products)));
    response.end();
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: `Internal error occured` }));
  }
};
module.exports = { home, teapot, task1, task2, task3 };
