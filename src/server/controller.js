const fs = require('fs');
const path = require('path');
const { createGunzip } = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');
const { nanoid } = require('nanoid');
const products = require('../../products.json');
const {
  setDiscountAsync,
  setDiscountPromise,
  setDiscountCallback,
  createCsvToJson,
  jsonOptimizer,
} = require('../services');

const { UPLOAD } = process.env;

let store = [];

const promisifiedPipeline = promisify(pipeline);

const home = response => {
  response.end(`Home 🏠`);
};

const notFound = response => {
  response.statusCode = 404;
  response.end(JSON.stringify({ message: `404 Not Found :(` }));
};

const badData = response => {
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

const uploadCsv = async inputStream => {
  const gunzip = createGunzip();
  const id = nanoid();

  try {
    await fs.promises.mkdir(UPLOAD, { recursive: true });
    console.log('Creating folder');
  } catch (error) {
    console.error(`Failed to create folder!`, error.message);
    return error;
  }

  const csvToJson = createCsvToJson();
  const filepath = path.resolve(UPLOAD, `${id}.json`);
  console.log('filepath :>> ', filepath);
  const outputStream = fs.createWriteStream(filepath);

  try {
    return await promisifiedPipeline(inputStream, gunzip, csvToJson, outputStream);
  } catch (error) {
    console.error('CSV pipeline has failed!\n', error || error.message);
    return error;
  }
};

const getListOfFiles = async response => {
  try {
    const files = await fs.promises.readdir(path.resolve(UPLOAD), { withFileTypes: true });
    console.log('files :>> ', files);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(files));
    response.end();
  } catch (error) {
    console.error(error.message);
    serverError(response);
  }
};

const optimizeJson = async (url, response) => {
  const filename = path.basename(url);
  try {
    await fs.promises.access(path.resolve(UPLOAD, filename));
    jsonOptimizer(filename);
    response.statusCode = 202;
    response.write(JSON.stringify({ status: '202 Accepted' }));
    response.end();
  } catch (error) {
    console.error(error.message);
    notFound(response);
  }
};

module.exports = {
  home,
  notFound,
  writeNewDataToJSON,
  blackFridayAsync,
  blackFridayCallback,
  blackFridayPromise,
  uploadCsv,
  getListOfFiles,
  optimizeJson,
};
