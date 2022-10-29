var express = require('express');
var router = express.Router();
var ServiceController = require('../controllers/ServiceController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', ServiceController.getById);
router.get('/getByPath/:path', ServiceController.getByPath);
router.post('/search', ServiceController.search);
router.post('/create', verifyToken, ServiceController.create);
router.post('/delete', verifyToken, ServiceController.delete);
router.post('/update', verifyToken, ServiceController.update);

module.exports = router;
