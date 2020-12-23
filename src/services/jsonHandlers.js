/* eslint-disable no-plusplus */
require('dotenv').config({ path: `${process.env.PWD}/.env` });
const fs = require('fs');
const db = require('../db');

const handleArray = (inputArray, outputArray) => {
  const handledArray = outputArray;

  inputArray.forEach(product => {
    const { type, color, quantity, price } = product;

    const elementIndex = handledArray.findIndex(
      element => element.type === type && element.color === color && element.price === price,
    );

    if (elementIndex >= 0) {
      handledArray[elementIndex].quantity += +quantity;
    } else {
      handledArray.push({ ...product, quantity: +quantity });
    }
  });
  return handledArray;
};

const createNewInDB = async (type, color, quantity, price) => {
  try {
    await db.createProduct({
      type,
      color,
      price: price + 0.99,
      quantity,
    });
  } catch (err) {
    console.error('NEW IN DB', err.message || 'errorr');
    throw err;
  }
};

const jsontodb = filename => {
  return new Promise((resolve, reject) => {
    const filepath = `upload/${filename}`;
    const inputStream = fs.createReadStream(filepath);

    let last = '';
    let c = 1;

    inputStream.on('data', chunk => {
      console.log('c :>> ', c++);
      const str = chunk.toString('utf8');

      if (last) last += str.split('{', 1)[0];

      const stringifiedJson = `${last}${str.slice(str.indexOf('{'), str.lastIndexOf('}') + 1)}`;

      const inputProducts = JSON.parse(`[${stringifiedJson}]`);

      inputProducts.forEach(e => {
        console.log('e :>> ', e);
        db.createProduct({
          type: e.type || 'no type',
          color: e.color || 'no color',
          quantity: e.quantity || 0,
          price: +e.price + 0.99,
        })
          .then(() => {
            console.log('+');
          })
          .catch(err => {
            return err;
          });
      });
      last = str.slice(str.lastIndexOf('},') + 2);
    });

    inputStream.on('end', () => {
      console.log('\nJSON TO DB\n');
      resolve();
    });

    inputStream.on('error', error => {
      console.error('ERRRO: jsontodb', error.message);
      reject(error);
    });
  });
};

const jsonOptimizer = filename => {
  return new Promise((resolve, reject) => {
    const filepath = `upload/${filename}`;
    const filepathOpt = `upload/opt-${filename}`;
    const inputStream = fs.createReadStream(filepath);

    let outputProducts = [];
    let last = '';

    inputStream.on('data', chunk => {
      const str = chunk.toString('utf8');

      if (last) last += str.split('{', 1)[0];

      const stringifiedJson = `${last}${str.slice(str.indexOf('{'), str.lastIndexOf('}') + 1)}`;

      const inputProducts = JSON.parse(`[${stringifiedJson}]`);
      // console.log('inputProducts :>> ', inputProducts);

      outputProducts = handleArray(inputProducts, outputProducts);

      last = str.slice(str.lastIndexOf('},') + 2);
    });

    inputStream.on('end', async () => {
      const totalQuantity = outputProducts.reduce((acc, current) => {
        return acc + current.quantity;
      }, 0);
      console.log('\nTotal quantity =', totalQuantity);

      fs.writeFile(filepathOpt, JSON.stringify(outputProducts, 0, '  '), () => {
        console.log(`\nFile ${filename} has been successfully optimized to opt-${filename}!\n`);
        fs.unlink(filepath, () => {
          console.log(`${filename} has been removed`);
        });
      });
      resolve();
    });

    inputStream.on('error', error => {
      console.error(error.message);
      reject(error);
    });
  });
};

module.exports = { jsonOptimizer, jsontodb, createNewInDB };
