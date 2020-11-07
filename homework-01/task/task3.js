const propEditor = array => {
  array.forEach(element => {
    if (!element.quantity) {
      Object.defineProperty(element, 'quantity', {
        value: 0,
        writable: true,
        configurable: true,
        enumerable: true
      });
    }
    if (element.priceForPair) {
      Object.defineProperty(element, 'price', Object.getOwnPropertyDescriptor(element, 'priceForPair'));
      delete element.priceForPair;
    }
  });
  return array;
};

module.exports = propEditor;
