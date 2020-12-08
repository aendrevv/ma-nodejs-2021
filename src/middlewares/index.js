module.exports = {
  myLogger: (req, res, next) => {
    console.log('Time:', Date.now());
    next();
  },
  errorHandler: (err, req, res, next) => {
    console.error({ err }, 'Global catch errors');

    let errMessage = { message: 'Internal server errors!' };
    if (!(parseInt(err.status, 10) === 500) && err.message) {
      res.status(err.status);
      errMessage = { message: err.message };
    } else {
      res.status(500);
    }

    res.json(errMessage);
    next();
  },
};
