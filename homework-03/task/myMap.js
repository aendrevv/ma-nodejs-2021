// 1. Створити функцію myMap яка буде повторювати функціонал методу масиву .map
// Допускається першим елементом передавати масив.
// Опціонально, створити myMap як метод класу Array який буде працювати аналогічно map.

const myMap = (array, callback, thisArg) => {
  if (this == null) {
    throw new TypeError(' this is null or not defined');
  }

  const len = array.length;

  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  let T;
  if (thisArg) {
    T = thisArg;
  }

  const A = new Array(len);

  let k = 0;

  while (k < len) {
    if (k in array) {
      A[k] = callback.call(T, array[k], k, array);
    }
    k += 1;
  }

  return A;
};

// module.exports = myMap;

const numbers = [114, 818, 6, 0, 898888, 14818];
const roots = myMap(numbers, num => {
  return num * num * num;
});
console.log(roots);
