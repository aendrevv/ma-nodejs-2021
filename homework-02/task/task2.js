const products = require('../products.json');

const whichIsMostExpensive = (array) => {
  let highestPriceElement = {};
  let highestPrice = 0;
  array.forEach((element) => {
    const totalPrice = +(element.priceForPair || element.price).slice(1) * (element.quantity || 0);
    if (totalPrice > highestPrice) {
      highestPriceElement = element;
      highestPrice = totalPrice;
    }
  });
  return highestPriceElement;
};

module.exports = whichIsMostExpensive(products);
