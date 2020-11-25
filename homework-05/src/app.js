const { port } = require('./config');
const app = require('./server');

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
