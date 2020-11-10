const arrayModifier = array => {
  return array.map(element => {
    const elementTemplate = {};
    elementTemplate.type = element.type;
    elementTemplate.color = element.color;
    elementTemplate.quantity = element.quantity || 0;
    elementTemplate.price = element.price || element.priceForPair;

    return elementTemplate;
  })
};

module.exports = arrayModifier;
