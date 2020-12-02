/* eslint-disable consistent-return */
const {
  home,
  notFound,
  writeNewDataToJSON,
  blackFridayAsync,
  blackFridayCallback,
  blackFridayPromise,
  uploadCsv,
  getListOfFiles,
  optimizeJson,
} = require('./controller');

const router = async (request, response) => {
  const { url, method, queryParams, body: data } = request;

  if (method === 'PUT' && url.startsWith('/optimize')) return optimizeJson(url, response);

  switch (url.pathname) {
    case '/':
      if (method === 'GET') home(response);
      break;
    case '/writeNewDataToJSON':
      if (method === 'PUT') writeNewDataToJSON(data, response);
      break;
    case `/blackFriday`:
      if (method === 'GET' && queryParams.field === 'async') await blackFridayAsync(response);
      if (method === 'GET' && queryParams.field === 'callback') blackFridayCallback(response);
      if (method === 'GET' && queryParams.field === 'promise') blackFridayPromise(response);
      break;
    case `/listOfFiles`:
      if (method === 'GET') await getListOfFiles(response);
      break;
    default:
      notFound(response);
      break;
  }
};

const streamRoutesHandler = async (request, response) => {
  const { url, method } = request;

  if (method === 'PUT' && url === '/uploadcsv') {
    try {
      console.log('\n\nREQUEST\n\n');
      await uploadCsv(request);
    } catch (error) {
      console.error('Failed to upload CSV-file', error);
      response.statusCode = 500;
      response.write(JSON.stringify({ message: '500 Server error' }));
      return response.end();
    }
    response.statusCode = 200;
    response.write(JSON.stringify({ message: 'OK' }));
    response.end();
  }
  console.log('123');
  notFound(response);
};

module.exports = { router, streamRoutesHandler };
