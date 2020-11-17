const { home, notFound, writeNewDataToJSON, blackFridayAsync } = require('./controller');

const router = async (request, response) => {
  const { url, method, body: data } = request;

  switch (url.pathname) {
    case '/':
      if (method === 'GET') home(response);
      break;
    case '/writeNewDataToJSON':
      if (method === 'PUT') writeNewDataToJSON(data, response);
      break;
    case `/blackFridayAsync`:
      if (method === 'GET') await blackFridayAsync(response);
      break;
    // case `/setDiscountAsync`:
    //   method === 'PUT' ? setDiscountAsync(response, queryParams) : notFound(response);
    //   break;
    default:
      notFound(response);
      break;
  }
};

module.exports = router;
