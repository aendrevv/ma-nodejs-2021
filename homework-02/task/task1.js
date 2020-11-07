const filter = (array, type, value) => {
  return array.filter((item) => item[type] === value);
};

module.exports = filter;
