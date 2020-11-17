const myMap = require('./myMap');
const { getDiscount, getDiscountPromise, getDiscountAsync } = require('./discount');

const arrayModifier = array => {
  return myMap(array, function (element) {
    if (!element.quantity) element.quantity = 0;
    if (element.priceForPair) {
      element.price = element.priceForPair;
      delete element.priceForPair;
    }
    let discount = getDiscountAsync();
    while (typeof discount !== 'number') discount = getDiscountAsync();
    element.discount = discount;
    element.priceWithDiscount = (element.price * (100 - discount)) / 100;
    return element;
  });
};
const my = [
  { type: 'boots', color: 'white', quantity: 18, priceForPair: '$7.5' },
  { type: 'cap', color: 'black', quantity: 51, priceForPair: '$1000' },
];
console.log(myMap(my));

module.exports = arrayModifier;
