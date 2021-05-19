const express = require('express');
const passport = require('passport');
const router = express.Router();

const commentController = require('../../../controllers/api/v1/comments_controller');

router.post('/create', passport.authenticate('jwt', { session: false }), commentController.create);

module.exports = router;