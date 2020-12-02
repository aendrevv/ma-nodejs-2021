const { fatal } = require('../utils');

require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  db: {
    user: process.env.DB_USER || fatal('FATAL'),
    host: process.env.DB_HOST || fatal('FATAL'),
    port: process.env.DB_PORT || fatal('FATAL'),
    database: process.env.DB_NAME || fatal('FATAL'),
    password: process.env.DB_PASS || fatal('FATAL'),
  },
};

module.exports = config;
