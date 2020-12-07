const http = require('http');
const requestsHandler = require('./requestHandler');

const server = http.createServer(requestsHandler);

const start = () => {
  const port = +process.env.PORT || 5000;
  const host = +process.env.HOST || 'localhost';

  server.listen(port, () => {
    console.log(`\n🤖 Server is listening ${host} on port ${port}!`);
  });
};

const stop = callback => {
  server.close(err => {
    if (err) {
      console.error(err, 'Failed to close server.');
      callback(err);
    }

    console.log('\n🤖 Server has been stopped.');
    callback();
  });
};

module.exports = { start, stop };
