require('dotenv').config();
const http = require('http');
const requestsHandler = require('./requestHandler');

const server = http.createServer(requestsHandler);
server.listen(+process.env.PORT, () =>
  console.log(`🤖 Server is listening on port ${process.env.PORT}!`),
);
