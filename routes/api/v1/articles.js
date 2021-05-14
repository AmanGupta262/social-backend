const express = require('express');
const passport = require('passport');
const router = express.Router();

const articleController = require('../../../controllers/api/v1/articles_controller');

router.post('/create', passport.authenticate('jwt', { session: false }), articleController.create);

module.exports = router;