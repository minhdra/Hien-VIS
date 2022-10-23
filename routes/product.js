var express = require('express');
var router = express.Router();
var ProductController = require('../controllers/ProductController');

/* GET users listing. */
router.get('/:_id', ProductController.getById);
router.post('/search', ProductController.search);
router.post('/create', ProductController.create);
router.post('/delete', ProductController.delete);
router.post('/update', ProductController.update);

module.exports = router;
