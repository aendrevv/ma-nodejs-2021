const { home, teapot, task1, task2, task3 } = require('./controller');

function notFound(res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 404;
  res.write('404 Not Found');
  res.end();
}

module.exports = (request, response) => {
  const { url, method, queryParams } = request;

  if (method === 'GET' && url === '/') return home(response);
  if (method === 'GET' && url === '/teapot') return teapot(response);
  if (method === 'GET' && url === `/task1?field=${queryParams.field}&value=${queryParams.value}`)
    return task1(response, queryParams);
  if (method === 'GET' && url === '/task2') return task2(response);
  if (method === 'GET' && url === '/task3') return task3(response);

  return notFound(response);
};
