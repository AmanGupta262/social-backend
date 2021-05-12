const express = require('express');
const router = express.Router();

const userController = require('../../../controllers/api/v1/user-controller');

router.post('/register', userController.register);

module.exports = router;