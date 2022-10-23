var express = require('express');
var router = express.Router();
var SlideController = require('../controllers/SlideController');

/* GET users listing. */
router.get('/:_id', SlideController.getById);
router.post('/search', SlideController.search);
router.post('/create', SlideController.create);
router.post('/delete', SlideController.delete);
router.post('/update', SlideController.update);

module.exports = router;
