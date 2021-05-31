const express = require('express');
const passport = require('passport');
const router = express.Router();

const searchController = require('../../../controllers/api/v1/search_controller');

router.get('/', searchController.search);


module.exports = router;