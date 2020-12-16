const { server } = require('./config');

// const { testConnection, createProduct, deleteProduct, createTable } = require('./db/pg');

const app = require('./server');

const boot = async () => {
  try {
    // await testConnection();
    // await createTable();

    // await createProduct({
    //   type: 'sword',
    //   color: 'silver',
    //   quantity: Date.now() % 39,
    //   price: (Date.now() % 100) + 0.99,
    // });

    // await deleteProduct(61);

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
  // await close();
  process.exit(1);
};

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);

process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

process.on('uncaughtException', exitHandler);
process.on('unhandledRejection', exitHandler);
