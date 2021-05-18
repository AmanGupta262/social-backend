const express = require('express');
const passport = require('passport');
const router = express.Router();

const articleController = require('../../../controllers/api/v1/articles_controller');

router.post('/create', passport.authenticate('jwt', { session: false }), articleController.create);
router.post('/:id/upvote', passport.authenticate('jwt', { session: false }), articleController.toggleUpvote);
router.post('/:id/downvote', passport.authenticate('jwt', { session: false }), articleController.toggleDownvote);

module.exports = router;