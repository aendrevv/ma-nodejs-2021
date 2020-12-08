const { server } = require('./config');
const app = require('./server');

app.listen(server.PORT, () => {
  console.log(`👾 App is listening at http://${server.HOST}:${server.PORT}`);
});
