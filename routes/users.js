var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

/* GET users listing. */
router.get('/:_id', UserController.getById);
router.post('/search', UserController.search);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/change-password', UserController.changePassword);
router.post('/delete', UserController.delete);
router.post('/update', UserController.update);

module.exports = router;
