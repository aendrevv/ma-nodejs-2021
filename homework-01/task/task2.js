const products = require('../products.json');

const whichIsMostExpensive = array => {
  let highestPriceElement = {};
  let highestPrice = Number.EPSILON;
  array.forEach(element => {
    let totalPrice = +(element.priceForPair || element.price).slice(1) * (element.quantity || 0);
    if (totalPrice > highestPrice) {
      highestPriceElement = Object.assign(element);
      highestPrice = totalPrice;
    }
  });
  return highestPriceElement;
}

module.exports = whichIsMostExpensive(products);