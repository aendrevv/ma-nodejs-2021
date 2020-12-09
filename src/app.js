const { server, db: dbConfig } = require('./config');
const app = require('./server');

const db = require('./db/pg')(dbConfig);

const boot = async () => {
  try {
    await db.testConnection();

    // const p = await db.createProduct({ type: 'socks', color: 'red', price: 14.88 });
    // console.log(`p: ${JSON.stringify(p)}`);

    app.listen(server.PORT, () => {
      console.log(`👾 App is listening at http://${server.HOST}:${server.PORT}`);
    });
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
};

boot();
