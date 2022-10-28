var express = require('express');
var router = express.Router();
var ImageController = require('../controllers/ImageController');
var upload = require('../middleware/uploadMiddleware');
var fileUploader = require('../configs/cloudinary.config');

/* GET users listing. */
router.post('/upload', upload.single('file'), ImageController.uploadSingle);
router.post('/cloudinary-upload', fileUploader.single('file'), ImageController.uploadSingle);
router.post('/remove', ImageController.remove);

module.exports = router;
