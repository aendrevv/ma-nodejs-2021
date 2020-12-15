const { server, db: dbConfig } = require('./config');

const db = require('./db/pg')(dbConfig);

const app = require('./server');

const boot = async () => {
  try {
    await db.testConnection();

    // const d = Date.now();
    // console.log('d :>> ', d);

    await db.createProduct({
      type: 'sword',
      color: 'silver',
      quantity: Date.now() % 29,
      price: (Date.now() % 100) + 0.99,
    });

    // await db.deleteProduct(p.id - 10);

    app.listen(server.PORT, () => {
      console.log(`👾 App is listening at http://${server.HOST}:${server.PORT}`);
    });
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
};

boot();

const exitHandler = async err => {
  if (err) console.error('\n>>> Error:\n', err.message || '');

  console.log('INFO: Processing shutdown... ');
  await db.close();
  process.exit();
};

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);

process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

process.on('uncaughtException', exitHandler);
process.on('unhandledRejection', exitHandler);
