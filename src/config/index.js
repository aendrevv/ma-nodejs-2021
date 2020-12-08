require('dotenv').config();

const { fatal } = require('../services');

const config = {
  server: {
    PORT: process.env.PORT || 5000,
    HOST: process.env.HOST || 'localhost',
  },

  user: {
    NAME: process.env.USER_NAME || fatal('No user name'),
    PASSWORD: process.env.USER_PASSWORD || fatal('No user password'),
  },

  folders: {
    UPLOAD: process.env.UPLOAD || `${process.cwd()}/uploads`,
  },
};

module.exports = config;
