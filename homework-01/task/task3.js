const arrayModifier = array => {
  return array.map(element => {
    if (!element.quantity) element.quantity = 0;
    if (element.priceForPair) {
      element.price = element.priceForPair;
      delete element.priceForPair;
      }

    return element;
  })
};

module.exports = arrayModifier;
