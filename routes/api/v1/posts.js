const express = require('express');
const passport = require('passport');
const router = express.Router();

const postController = require('../../../controllers/api/v1/posts_controller');

router.get('/', postController.getAllPosts);
router.post('/create', passport.authenticate('jwt', { session: false }), postController.create);
router.post('/:id/like', passport.authenticate('jwt', { session: false }), postController.toggleLike);
router.get('/:id', passport.authenticate('jwt', { session: false }), postController.showPost);
router.put('/:id/update', passport.authenticate('jwt', { session: false }), postController.update);
router.delete('/:id/delete', passport.authenticate('jwt', { session: false }), postController.delete);

module.exports = router;