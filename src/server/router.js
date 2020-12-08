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
} = require('./controller');

router.get('/', home);
router.put('/uploadcsv', convertCsvToJson);
router.get('/upload/listOfFiles', getListOfFiles);
router.post('/optimize/:filename', optimizeJson);
router.get('/blackfriday/async', blackFridayAsync);
router.get('/blackfriday/clbck', blackFridayCallback);
router.get('/blackfriday/prmss', blackFridayPromise);
router.put('/newjson', writeNewDataToJSON);

module.exports = router;
