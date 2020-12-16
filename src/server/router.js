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
  deleteProductByIdSoft,
  deleteProductByIdHard,
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
router.post('/db/push/:filename', fromJSONtoDB);
router.post('/db/create', createOneInDB);
router.get('/db/get/:id', getProductById);
router.get('/db/getAll', getAll);
router.put('/db/update/:id', updateProductById);
router.delete('/db/delete/:id', deleteProductByIdSoft);
router.delete('/db/remove/:id', deleteProductByIdHard);

module.exports = router;
