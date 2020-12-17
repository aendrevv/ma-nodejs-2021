/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
const {
  db: { config, defaultType },
} = require('../config');

const db = {};
let type = defaultType;

const funcWrapper = func =>
  typeof func === 'function'
    ? func
    : console.log(`FATAL: Cannot find ${func.name} function for current DB wrapper`);

const init = async () => {
  try {
    for (const [k, v] of Object.entries(config)) {
      const wrapper = require(`./${k}`)(v);
      await wrapper.testConnection();
      console.log(`INFO: DB wrapper for ${k} initialized.`);
      db[k] = wrapper;
    }
  } catch (err) {
    console.log('FATAL: ', err.message || err);
  }
};

const end = async () => {
  for (const [k, v] of Object.entries(db)) {
    await v.close();
    console.log(`INFO: DB wrapper for ${k} was closed.`);
  }
};

const setType = t => {
  if (!t || !db[t]) {
    console.log('WARNING: Cannot find provided DB type.');
    return false;
  }
  type = t;
  console.log(`INFO: The DB type has been changed to ${t}`);
  return true;
};

const getType = () => type;

const dbWrapper = t => db[t] || db[type];

module.exports = {
  init,
  end,
  setType,
  getType,
  dbWrapper,
  //---------------------------
  testConnection: async () => funcWrapper(dbWrapper().testConnection)(),
  close: async () => funcWrapper(dbWrapper().close)(),
  createProduct: async prod => funcWrapper(dbWrapper().createProduct)(prod),
  getProduct: async id => funcWrapper(dbWrapper().getProduct)(id),
  updateProduct: async prod => funcWrapper(dbWrapper().updateProduct)(prod),
  removeProduct: async id => funcWrapper(dbWrapper().hardDeleteProduct)(id),
  deleteProduct: async id => funcWrapper(dbWrapper().softDeleteProduct)(id),
};
