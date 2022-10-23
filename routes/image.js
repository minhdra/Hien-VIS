var express = require('express');
var router = express.Router();
var ImageController = require('../controllers/ImageController');
var upload = require('../middleware/uploadMiddleware');

/* GET users listing. */
router.post('/upload', upload.single('file'), ImageController.uploadSingle);
router.post('/remove', ImageController.remove);

module.exports = router;
