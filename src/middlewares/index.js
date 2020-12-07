const myLogger = (req, res, next) => {
  console.log('Time:', Date.now());
  next();
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).render('error', { error: err });
};

module.exports = { myLogger, errorHandler };
