require('dotenv').config();
const server = require('./server');

const enableGracefulExit = () => {
  const exitHandler = error => {
    if (error) console.error(error);

    console.log('Stopping... (as gracefully as possible))');
    server.stop(() => {
      process.exit();
    });
  };

  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);

  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);

  process.on('uncaughtException', exitHandler);
  process.on('unhandledRejection', exitHandler);
};

const boot = () => {
  enableGracefulExit();
  server.start();
};

boot();
