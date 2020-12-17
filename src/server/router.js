const router = require('express').Router();

const {
  home,
  writeNewDataToJSON,
  blackFridayAsync,
  blackFridayCallback,
  blackFridayPromise,
  convertCsvToJson,
  getListOfFiles,
  optimizeJson,
  fromJSONtoDB,
  createOneInDB,
  getProductById,
  getAll,
  updateProductById,
  deleteProduct,
  removeProduct,
  testc,
} = require('./controller');
// PREVIOUS
router.get('/', home);
router.put('/uploadcsv', convertCsvToJson);
router.get('/upload/listOfFiles', getListOfFiles);
router.post('/optimize/:filename', optimizeJson);
router.get('/blackfriday/async', blackFridayAsync);
router.get('/blackfriday/clbck', blackFridayCallback);
router.get('/blackfriday/prmss', blackFridayPromise);
router.put('/newjson', writeNewDataToJSON);
// DB
router.get('/db/', testc);
router.post('/db/push/:filename', fromJSONtoDB);
router.post('/db/create', createOneInDB);
router.get('/db/get/:id', getProductById);
router.get('/db/getAll', getAll);
router.put('/db/update/:id', updateProductById);
router.delete('/db/delete/:id', deleteProduct);
router.delete('/db/remove/:id', removeProduct);

module.exports = router;
