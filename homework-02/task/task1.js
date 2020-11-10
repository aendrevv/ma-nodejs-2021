const filterByTypeAndValue = (array, type, value) => {
  return array.filter(item => item[type] === value);
};

module.exports = filterByTypeAndValue;
