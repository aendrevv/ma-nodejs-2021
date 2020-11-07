const { home, comment } = require('./controller');

function notFound(res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 404;
  res.write('404 Not Found');
  res.end();
}

module.exports = (request, response) => {
  const { url, method, queryParams, body: data } = request;

  if (method === 'GET' && url === '/') return home(response);
  if (method === 'POST' && url === '/comment') return comment(data, response, queryParams);
  return notFound(response);
};
