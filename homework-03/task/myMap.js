// 1. Створити функцію myMap яка буде повторювати функціонал методу масиву .map
// Допускається першим елементом передавати масив.
// Опціонально, створити myMap як метод класу Array який буде працювати аналогічно map.

const myMap = (array, callback, thisArg) => {
  const len = array.length;

  // if (typeof callback !== 'function') {
  //   throw new TypeError(`${callback} is not a function`);
  // }

  let T;
  if (thisArg) {
    T = thisArg;
  }

  const returningArray = new Array(len);

  let k = 0;

  while (k < len) {
    if (k in array) {
      returningArray[k] = callback.call(T, array[k], k, array);
    }
    k += 1;
  }

  return returningArray;
};

module.exports = myMap;
