const { Pool } = require('pg');

const { db: dbConfig } = require('../../config');

const client = new Pool(dbConfig);

module.exports = client;
