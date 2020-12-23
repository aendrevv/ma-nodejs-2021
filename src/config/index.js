require('dotenv').config();

const fatal = message => {
  console.error(`\nFATAL: ${message}\n`);
  process.exit(1);
};

const config = {
  server: {
    PORT: process.env.PORT || 5002,
    HOST: process.env.HOST || 'localhost',
  },

  user: {
    NAME: process.env.USER_NAME || fatal('No user name'),
    PASSWORD: process.env.USER_PASSWORD || fatal('No user password'),
  },

  db: {
    defaultType: process.env.DB_WRAPPER || 'knex',
    config: {
      pg: {
        user: process.env.DB_USER || fatal('DB_USER is not defined'),
        host: process.env.DB_HOST || fatal('DB_HOST is not defined'),
        port: process.env.DB_PORT || fatal('DB_PORT is not defined'),
        database: process.env.DB_NAME || fatal('DB_NAME is not defined'),
        password: process.env.DB_PASS || fatal('DB_PASS is not defined'),
      },

      knex: {
        client: 'pg',
        connection: {
          user: process.env.DB_USER || fatal('DB_USER is not defined'),
          host: process.env.DB_HOST || fatal('DB_HOST is not defined'),
          port: process.env.DB_PORT || fatal('DB_PORT is not defined'),
          database: process.env.DB_NAME || fatal('DB_NAME is not defined'),
          password: process.env.DB_PASS || fatal('DB_PASS is not defined'),
        },
        pool: {
          min: 2,
          max: 10,
        },
        debug: false,
        migrations: {
          tableName: 'knex_migrations',
        },
      },
    },
  },

  tables: {
    products: process.env.TABLE_NAME || 'products',
    colors: 'colors',
    types: 'types',
  },

  folders: {
    UPLOAD: process.env.UPLOAD || `${process.cwd()}/uploads`,
  },
};

module.exports = config;
