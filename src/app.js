// require('dotenv').config();
// const http = require('http');
// const requestsHandler = require('./server/requestHandler');

// const port = +process.env.PORT || 5000;

// const server = http.createServer(requestsHandler);
// server.listen(port, () => console.log(`🤖 Server is listening on port ${port}!`));

const { port, db: dbConfig } = require('./config');
const app = require('./server');

const db = require('./db')(dbConfig);

const boot = async () => {
  try {
    await db.testConnection();

    const p1 = await db.createProduct({ type: 'socks', color: 'red', price: 3.33 });
    console.log(`p1: ${JSON.stringify(p1)}`);

    const p2 = await db.getProduct(p1.id);
    console.log(`p2: ${JSON.stringify(p2)}`);

    const p3 = await db.updateProduct({
      id: p1.id,
      type: 'gloves',
      color: 'orange',
      quantity: 116,
      price: 4.99,
    });
    console.log(`p3: ${JSON.stringify(p3)}`);

    // await db.deleteProduct(p1.id);
    const p4 = await db.getProduct(p1.id);
    console.log(`p4: ${JSON.stringify(p4)}`);

    app.listen(port, () => console.log(`🤖 DB is listening on port ${port}!`));
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
};

boot();
