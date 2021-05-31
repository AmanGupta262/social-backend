const express = require('express');
const passport = require('passport');
const router = express.Router();

const searchController = require('../../../controllers/api/v1/search_controller');

router.get('/', passport.authenticate('jwt', { session: false }), searchController.search);
router.get('/users/', passport.authenticate('jwt', { session: false }), searchController.searchUser);


module.exports = router;