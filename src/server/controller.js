/* eslint-disable consistent-return */
const fs = require('fs');
const path = require('path');
const { createGunzip } = require('zlib');
const { pipeline } = require('stream');
const { nanoid } = require('nanoid');
const { promisify } = require('util');
const products = require('../../products.json');
const {
  setDiscountAsync,
  setDiscountPromise,
  setDiscountCallback,
  createCsvToJson,
  jsonOptimizer,
  jsontodb,
  createNewInDB,
} = require('../services');

const {
  folders: { UPLOAD },
} = require('../config');

let store = [];

const promisifiedPipeline = promisify(pipeline);

const home = (req, res) => {
  res.status(200).json({ message: 'Home 🏠' });
};

const notFound = (req, res) => {
  res.status(404).json({ message: '404 Not Found' });
};

const badData = (req, res) => {
  res.status(406).json({ message: '406 Bad data' });
};

const writeNewDataToJSON = (req, res) => {
  const data = req.body;
  if (!Array.isArray(data) || !data.some(e => e.type && e.color && (e.price || e.priceForPair)))
    return badData(res);

  try {
    fs.writeFileSync(path.resolve('./', `products.json`), JSON.stringify(data));
    res.status(200).json({ message: `Done. Check products.json`, data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: '500 Internal Server Error' });
  }
};

const blackFridayAsync = async (req, res) => {
  try {
    store = await setDiscountAsync(products);
    res.status(200).json({ message: `Done. Check products.json`, store });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: '500 Internal Server Error' });
  }
};

const blackFridayPromise = (req, res) => {
  try {
    setDiscountPromise(products).then(storage => {
      res.status(200).json({ message: `Done`, storage });
    });
    return;
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: '500 Internal Server Error' });
  }
};

const blackFridayCallback = (req, resp) => {
  try {
    return setDiscountCallback(products, resp, (res, storage) => {
      res.status(200).json({ message: `Done`, storage });
    });
  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: '500 Internal Server Error' });
  }
};

const uploadCsv = async inputStream => {
  const gunzip = createGunzip();
  const id = nanoid(6);

  try {
    await fs.promises.mkdir(path.resolve(UPLOAD), { recursive: true });
    console.log('Creating folder');
  } catch (error) {
    console.error(`Failed to create folder!`, error.message);
    return error;
  }

  const csvToJson = createCsvToJson();
  const filepath = `${UPLOAD}${id}.json`;
  console.log('filepath :>> ', filepath);
  const outputStream = fs.createWriteStream(filepath);

  try {
    return await promisifiedPipeline(inputStream, gunzip, csvToJson, outputStream);
  } catch (error) {
    console.error('CSV pipeline has failed!\n', error || error.message);
    return error;
  }
};

const convertCsvToJson = async (req, res) => {
  try {
    await uploadCsv(req);
    res.status(200).json({ message: '200 OK' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '500 Internal Server Error' });
  }
};

const getListOfFiles = async (req, res) => {
  try {
    const fls = await fs.promises.readdir(path.resolve(UPLOAD), { withFileTypes: true });
    console.log('files :>> ', fls);
    res.status(200).json({ files: fls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '500 Internal Server Error' });
  }
};

const optimizeJson = async (req, res) => {
  const filename = path.basename(req.url);
  try {
    await fs.promises.access(path.resolve(UPLOAD, filename));
    console.log('\nWaiting...\n');
    jsonOptimizer(filename);
    res.status(202).json({ message: '202 Accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '500 Internal Server Error' });
  }
};

const fromJSONtoDB = async (req, res) => {
  const filename = path.basename(req.url);
  try {
    await fs.promises.access(path.resolve(UPLOAD, filename));
    console.log('\nWaiting-jsontodb-\n');
    jsontodb(filename);
    res.status(205).json({ message: '204 No Content' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '500 Internal Server Error' });
  }
};

const createOneInDB = async (req, res) => {
  const { type, color, price, quantity } = req.query;
  try {
    await createNewInDB(type, color, price, quantity);
    res.status(200).json({ message: '200 OK' });
  } catch (err) {
    console.error('CREATE >>>\n', err);
    res.status(500).json({ message: '500 Internal Server Error: CREATE >>>' });
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
  convertCsvToJson,
  getListOfFiles,
  optimizeJson,
  fromJSONtoDB,
  createOneInDB,
};
