/* eslint-disable no-unused-expressions */
const {
  home,
  notFound,
  teapot,
  task1,
  task2,
  task3,
  writeNewDataToVariable,
  writeNewDataToJSON,
} = require('./controller');

// eslint-disable-next-line consistent-return
const router = (request, response) => {
  const { url, method, queryParams, body: data } = request;

  switch (url.pathname) {
    case '/':
      method === 'GET' ? home(response) : notFound(response);
      break;
    case '/teapot':
      method === 'GET' ? teapot(response) : notFound(response);
      break;
    case '/task1':
      method === 'GET' ? task1(response, queryParams) : notFound(response);
      break;
    case '/task2':
      method === 'GET' ? task2(response) : notFound(response);
      break;
    case '/task3':
      method === 'GET' ? task3(response) : notFound(response);
      break;
    case '/writeNewDataToVariable':
      method === 'PUT' ? writeNewDataToVariable(data, response) : notFound(response);
      break;
    case '/writeNewDataToJSON':
      method === 'PUT' ? writeNewDataToJSON(data, response) : notFound(response);
      break;
    default:
      notFound(response);
      break;
  }
};

module.exports = router;
