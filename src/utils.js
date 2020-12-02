module.exports = {
  fatal: message => {
    console.error(message);
    process.exit();
  },
};
