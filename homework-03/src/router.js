const {
  home,
  notFound,
  writeNewDataToJSON,
  blackFridayAsync,
  blackFridayCallback,
  blackFridayPromise,
} = require('./controller');

const router = async (request, response) => {
  const { url, method, queryParams, body: data } = request;

  switch (url.pathname) {
    case '/':
      if (method === 'GET') home(response);
      break;
    case '/writeNewDataToJSON':
      if (method === 'PUT') writeNewDataToJSON(data, response);
      break;
    case `/blackFriday`:
      if (method === 'GET' && queryParams.field === 'async') await blackFridayAsync(response);
      if (method === 'GET' && queryParams.field === 'callback') await blackFridayCallback(response);
      if (method === 'GET' && queryParams.field === 'promise') blackFridayPromise(response);
      break;
    default:
      notFound(response);
      break;
  }
};

module.exports = router;
