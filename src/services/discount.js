require('dotenv').config();

const myMap = require('./myMap');
const arrayModifier = require('./tasks');

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

const discountHandlerPro = callback => {
  discountHandlerCallback((err, res) => {
    if (err) return discountHandlerPro(callback);

    return callback(null, res);
  });
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
    discountHandlerPro((error, result) => {
      if (error) rej(error);
      else res(result);
    });
  });
};

const getDiscountPromise = discountNumber => {
  const promiseArray = [];

  for (let i = 0; i < discountNumber; i += 1) {
    promiseArray.push(discountHandlerPromise());
  }

  return Promise.all(promiseArray).then(d => {
    const discount = d.reduce((acc, cur) => acc + cur / 100, 0);

    return discount;
  });
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
  const returningArray = myMap(modifiedArray, async element => {
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

const setDiscountCallback = (array, res, callback) => {
  const returningArray = [];
  const modifiedArray = arrayModifier(array);

  myMap(modifiedArray, element => {
    let discountNumber = 1;
    if (element.type === 'hat') {
      discountNumber = 2;
      if (element.color === 'red') discountNumber = 3;
    }

    getDiscountCallback(discountNumber, [], discountValues => {
      const discount = discountValues.reduce((acc, cur) => acc * (1 - cur / 100), 1);
      element.newPrice = `$${(element.price.slice(1) * discount).toFixed(2)}`;
      element.discount = `${((1 - discount) * 100).toFixed(0)}%`;
      returningArray.push(element);

      if (returningArray.length === modifiedArray.length) {
        callback(res, returningArray);
      }
    });
  });
};

const setDiscountPromise = array => {
  return new Promise((resolve, reject) => {
    const returningArray = [];
    const modifiedArray = arrayModifier(array);

    myMap(modifiedArray, element => {
      let discountNumber = 1;
      if (element.type === 'hat') {
        discountNumber = 2;
        if (element.color === 'red') discountNumber = 3;
      }

      getDiscountPromise(discountNumber).then(discount => {
        element.newPrice = `$${(element.price.slice(1) * (1 - discount)).toFixed(2)}`;
        element.discount = `${(discount * 100).toFixed(0)}%`;
        returningArray.push(element);

        if (returningArray.length === modifiedArray.length) {
          resolve(returningArray);
        } else if (returningArray.length > modifiedArray.length) {
          reject(new Error('Too many elements'));
        }
      });
    });
  });
};

module.exports = { setDiscountAsync, setDiscountPromise, setDiscountCallback };
