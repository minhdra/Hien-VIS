var express = require('express');
var router = express.Router();
var ServiceController = require('../controllers/ServiceController');

/* GET users listing. */
router.get('/:_id', ServiceController.getById);
router.post('/search', ServiceController.search);
router.post('/create', ServiceController.create);
router.post('/delete', ServiceController.delete);
router.post('/update', ServiceController.update);

module.exports = router;
