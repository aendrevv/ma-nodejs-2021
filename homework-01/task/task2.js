const products = require('../products.json');

const whatIsMoreExpensive = array => {
  let socksTotalPrice = 0;
  let hatsTotalPrice = 0;
  array.forEach(element => {
    if (element.type === 'socks') {
      socksTotalPrice += +element.priceForPair.slice(1) * (element.quantity || 0);
    }
    if (element.type === 'hat') {
      hatsTotalPrice += +element.price.slice(1) * (element.quantity || 0);
    }
  });
  if (socksTotalPrice > hatsTotalPrice) return `socks ${socksTotalPrice}`;
  return `hats ${hatsTotalPrice}`;
};

module.exports = whatIsMoreExpensive(products);