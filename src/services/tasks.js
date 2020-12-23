// task 1
const filterByTypeAndValue = (array, type, value) => {
  return array.filter(item => item[type] === value);
};
// task 2
const whichIsMostExpensive = array => {
  let highestPriceElement = {};
  let highestPrice = 0;
  array.forEach(element => {
    const totalPrice = +(element.priceForPair || element.price).slice(1) * (element.quantity || 0);
    if (totalPrice > highestPrice) {
      highestPriceElement = element;
      highestPrice = totalPrice;
    }
  });
  return highestPriceElement;
};
// task 3
const arrayModifier = array => {
  return array.map(element => {
    if (!element.quantity) element.quantity = 0;
    if (element.priceForPair) {
      element.price = element.priceForPair;
      delete element.priceForPair;
    }

    return element;
  });
};

module.exports = { whichIsMostExpensive, filterByTypeAndValue, arrayModifier };
