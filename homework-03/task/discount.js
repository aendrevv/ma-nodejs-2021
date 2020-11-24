require('dotenv').config();
const util = require('util');

const myMap = require('./myMap');
const arrayModifier = require('./task3');

const maxDiscount = +process.env.MAXDISCOUNT || 20;
const delay = +process.env.DELAY || 50;
const errorMessage = `TOO BIG DISCOUNT!`;

const randomNumberGenerator = () => (Math.floor(Math.random() * 1e6) % 99) + 1;

const discountHandlerCallback = callback => {
  setTimeout(() => {
    const currentDiscount = randomNumberGenerator();
    if (currentDiscount >= maxDiscount) return callback(new Error(errorMessage));
    return callback(null, currentDiscount);
  }, delay);
};

const getDiscountCallback = (discountNumber, discountValues, callback) => {
  discountHandlerCallback((error, result) => {
    if (error) return getDiscountCallback(discountNumber, discountValues, callback);

    discountValues.push(result);
    if (discountValues.length < discountNumber)
      getDiscountCallback(discountNumber, discountValues, callback);
    else callback(discountValues);
    return true;
  });
};

const discountHandlerPromise = () => {
  return new Promise((res, rej) => {
    discountHandlerCallback((error, result) => {
      if (error) rej(error);
      else res(result);
    });
  });
};

const getDiscountPromisified = util.promisify(discountHandlerCallback);

const getDiscountPromise = (discountNumber, discountValues, callback) => {
  getDiscountPromisified()
    .then(disc => {
      discountValues.push(disc);
      if (discountValues.length < discountNumber)
        getDiscountPromise(discountNumber, discountValues, callback);
      else callback(discountValues);
    })
    .catch(() => getDiscountPromise(discountNumber, discountValues, callback));
};

const getDiscountAsync = async () => {
  let res;
  try {
    res = await discountHandlerPromise();
  } catch (error) {
    res = await getDiscountAsync();
  }
  return res;
};

const setDiscountAsync = async array => {
  const modifiedArray = arrayModifier(array);
  const returningArray = await myMap(modifiedArray, async element => {
    try {
      element.discount = 1 - (await getDiscountAsync()) / 100;
      if (element.type === 'hat') {
        element.discount *= 1 - (await getDiscountAsync()) / 100;
        if (element.color === 'red') {
          element.discount *= 1 - (await getDiscountAsync()) / 100;
        }
      }
      element.newPrice = `$${(element.price.slice(1) * element.discount).toFixed(2)}`;
      element.discount = `${((1 - element.discount) * 100).toFixed(0)}%`;
    } catch (error) {
      console.log('OOPS!');
    }
    return element;
  });
  return Promise.all(returningArray);
};

const setDiscountCallback = array => {
  const modifiedArray = arrayModifier(array);
  const returningArray = myMap(modifiedArray, element => {
    let discountNumber = 1;
    if (element.type === 'hat') {
      discountNumber = 2;
      if (element.color === 'red') discountNumber = 3;
    }

    getDiscountCallback(discountNumber, [], discountValues => {
      const discount = discountValues.reduce((acc, cur) => acc * (1 - cur / 100), 1);
      element.newPrice = `$${(element.price.slice(1) * discount).toFixed(2)}`;
      element.discount = `${((1 - discount) * 100).toFixed(0)}%`;
    });

    return element;
  });

  return returningArray;
};

const setDiscountPromise = array => {
  const modifiedArray = arrayModifier(array);
  const returningArray = myMap(modifiedArray, element => {
    let discountNumber = 1;
    if (element.type === 'hat') {
      discountNumber = 2;
      if (element.color === 'red') discountNumber = 3;
    }

    getDiscountPromise(discountNumber, [], discountValues => {
      const discount = discountValues.reduce((acc, cur) => acc * (1 - cur / 100), 1);
      element.newPrice = `$${(element.price.slice(1) * discount).toFixed(2)}`;
      element.discount = `${((1 - discount) * 100).toFixed(0)}%`;
    });

    return element;
  });

  return returningArray;
};

module.exports = { setDiscountAsync, setDiscountPromise, setDiscountCallback };
