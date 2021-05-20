const express = require('express');
const passport = require('passport');
const router = express.Router();

const articleController = require('../../../controllers/api/v1/articles_controller');

router.get('/', passport.authenticate('jwt', { session: false }), articleController.getAllArticles);
router.post('/create', passport.authenticate('jwt', { session: false }), articleController.create);
router.post('/:id/upvote', passport.authenticate('jwt', { session: false }), articleController.toggleUpvote);
router.post('/:id/downvote', passport.authenticate('jwt', { session: false }), articleController.toggleDownvote);
router.get('/:id', passport.authenticate('jwt', { session: false }), articleController.showArticle);
router.put('/:id/update', passport.authenticate('jwt', { session: false }), articleController.update);
router.delete('/:id/delete', passport.authenticate('jwt', { session: false }), articleController.delete);

module.exports = router;