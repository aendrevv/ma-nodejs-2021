const { server } = require('./config');

const db = require('./db');

// const { testConnection, createProduct, deleteProduct, createTable } = require('./db/pg');

const app = require('./server');

const boot = async () => {
  try {
    await db.init();
    console.log(`New DB type is ${db.getType()}`);

    db.setType('knex');
    console.log(`New DB type is ${db.getType()}`);

    // await db.createTable();

    await db.createProduct({
      type: 'axe',
      color: 'epic',
      quantity: Date.now() % 10,
      price: (Date.now() % 1000) + 0.99,
    });

    // await db.deleteProduct(61);

    app.listen(server.PORT, () => {
      console.log(`👾 App is listening at http://${server.HOST}:${server.PORT}`);
    });
  } catch (error) {
    console.error('BOOT >> ', error.message || error);
    throw error;
  }
};

boot();

const exitHandler = async err => {
  if (err) console.error('EXIT >> ', err.message || '');

  console.log('INFO: Processing shutdown... ');
  await db.end();
  process.exit(1);
};

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);

process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

process.on('uncaughtException', exitHandler);
process.on('unhandledRejection', exitHandler);
