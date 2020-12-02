// 1. Створити функцію myMap яка буде повторювати функціонал методу масиву .map
// Допускається першим елементом передавати масив.
// Опціонально, створити myMap як метод класу Array який буде працювати аналогічно map.

const myMap = (array, callback) => {
  const { length } = array;
  const returningArray = new Array(length);

  let k = 0;
  try {
    while (k < length) {
      if (k in array) {
        returningArray[k] = callback(array[k], k, array);
      }
      k += 1;
    }
  } catch (error) {
    console.error(error);
  }

  return returningArray;
};

module.exports = myMap;
