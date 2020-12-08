const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');

const { myLogger, errorHandler } = require('../middlewares');

const router = require('./router');
const { user } = require('../config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const basicAuthOptions = {
  users: { [user.NAME]: user.PASSWORD },
  unauthorizedResponse: { message: 'Unauthorized' },
};
app.use(myLogger);

app.use(basicAuth(basicAuthOptions), router);

app.use((req, res, next) => {
  res.status(404).json({ message: '404 Not found' });
  next();
});

app.use(errorHandler);

module.exports = app;
