const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../../../controllers/api/v1/users_controller');

router.get('/', passport.authenticate('jwt', { session: false }), userController.getUsers);
router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/:id/posts', userController.getPosts);
router.get('/:id/articles', passport.authenticate('jwt', {session: false}), userController.getArticles);

router.get('/:id', passport.authenticate('jwt', { session: false }), userController.profile);

router.post('/forgot/password', userController.sendMail);
router.post('/change/password', userController.resetPassword);

router.get('/:id/friends', passport.authenticate('jwt', { session: false }), userController.getFriends);

module.exports = router;