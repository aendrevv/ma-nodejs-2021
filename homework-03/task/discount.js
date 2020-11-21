// 2. Створити функцію з колбеком для генерування знижки, яка поверне свій результат в колбек через 50мс.
// Згенерувати знижку випадковим чином в діапазоні від 1 до 99%.
// Оскільки магазин не може собі дозволити великі знижки, то якщо знижка буде більше 20 (включно),
// функція поверне помилку, інакше поверне значення знижки.
// Створити обгортки над функцією з колбеком для полегшення роботи з асинхронними функціями.
// Обгортки мають бути реалізовані двома способами.
require('dotenv').config();

const myMap = require('./myMap');

const maxDiscount = +process.env.MAXDISCOUNT || 20;
const delay = +process.env.DELAY || 50;
const errorMessage = `TOO BIG DISCOUNT!`;

const randomNumberGenerator = () => Math.floor(Math.random() * 1e6) % 99;

const discountHandlerCallback = callback => {
  const currentDiscount = randomNumberGenerator();
  setTimeout(() => {
    if (currentDiscount > maxDiscount) return callback(new Error(errorMessage));
    return callback(null, currentDiscount);
  }, delay);
};

const getDiscountCallback = () => {
  return discountHandlerCallback((error, result) => {
    if (error) getDiscountCallback();
    console.log(result);
    return result;
  });
};

const discountHandlerPromise = () => {
  const currentDiscount = randomNumberGenerator();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentDiscount > maxDiscount) {
        reject(new Error(errorMessage));
      }
      resolve(currentDiscount);
    }, delay);
  });
};

const getDiscountPromise = async () => {
  let res;
  try {
    res = await discountHandlerPromise();
  } catch (error) {
    res = await getDiscountPromise();
  }
  return res;
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
  const returnedArr = await myMap(array, async element => {
    try {
      if (!element.quantity) element.quantity = 0;
      if (element.priceForPair) {
        element.price = element.priceForPair;
        delete element.priceForPair;
      }
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
  return Promise.all(returnedArr);
};

const setDiscountPromise = async array => {
  const returnedArr = await myMap(array, async element => {
    if (!element.quantity) element.quantity = 0;
    if (element.priceForPair) {
      element.price = element.priceForPair;
      delete element.priceForPair;
    }
    element.discount = 1 - (await getDiscountPromise()) / 100;
    if (element.type === 'hat') {
      element.discount *= 1 - (await getDiscountPromise()) / 100;
      if (element.color === 'red') {
        element.discount *= 1 - (await getDiscountPromise()) / 100;
      }
    }
    element.newPrice = `$${(element.price.slice(1) * element.discount).toFixed(2)}`;
    element.discount = `${((1 - element.discount) * 100).toFixed(0)}%`;
    return element;
  });
  return Promise.all(returnedArr);
};

const setDiscountCallback = async array => {
  const returnedArr = await myMap(array, element => {
    if (!element.quantity) element.quantity = 0;
    if (element.priceForPair) {
      element.price = element.priceForPair;
      delete element.priceForPair;
    }
    element.discount = 1 - getDiscountCallback() / 100;
    if (element.type === 'hat') {
      element.discount *= 1 - getDiscountCallback() / 100;
      if (element.color === 'red') {
        element.discount *= 1 - getDiscountCallback() / 100;
      }
    }
    element.newPrice = `$${(element.price.slice(1) * element.discount).toFixed(2)}`;
    element.discount = `${((1 - element.discount) * 100).toFixed(0)}%`;
    return element;
  });
  return returnedArr;
};

module.exports = { setDiscountAsync, setDiscountPromise, setDiscountCallback };
