const express = require('express');
const passport = require('passport');
const router = express.Router();

const postController = require('../../../controllers/api/v1/posts_controller');

router.post('/create', passport.authenticate('jwt', {session: false}), postController.create);

module.exports = router;