const { port } = require('./config');
const app = require('./server');

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
