require('dotenv').config();
const http = require('http');
const requestsHandler = require('./requestHandler');

const port = +process.env.PORT || 5000;

const server = http.createServer(requestsHandler);
server.listen(port, () => console.log(`🤖 Server is listening on port ${port}!`));
