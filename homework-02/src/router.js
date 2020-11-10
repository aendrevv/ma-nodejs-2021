const {
  home,
  notFound,
  teapot,
  task1,
  task2,
  task3,
  downloadNewDataArray,
  downloadAndSaveNewDataArray,
} = require('./controller');

module.exports = (request, response) => {
  const { url, method, queryParams, body: data } = request;

  if (method === 'GET' && url === '/') return home(response);

  if (method === 'GET' && url === '/teapot') return teapot(response);

  if (method === 'GET' && url === `/task1?field=${queryParams.field}&value=${queryParams.value}`)
    return task1(response, queryParams);

  if (method === 'GET' && url === '/task2') return task2(response);

  if (method === 'GET' && url === '/task3') return task3(response);

  if (method === 'POST' && url === '/downloadNewDataArray')
    return downloadNewDataArray(data, response);

  if (method === 'POST' && url === '/downloadAndSaveNewDataArray')
    return downloadAndSaveNewDataArray(data, response);

  return notFound(response);
};
