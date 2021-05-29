const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../../../controllers/api/v1/users_controller');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/auth/google', passport.authenticate('google', { session: false,scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', { session: false,}), userController.createSession);

router.get('/auth/github', passport.authenticate('github', { session: false, scope: ['user: email'] }));
router.get('/auth/github/callback', passport.authenticate('github'), userController.createSession);

router.get('/auth/facebook', passport.authenticate('facebook', { session: false }));
router.get('/auth/facebook/callback', passport.authenticate('facebook'), userController.createSession);

router.get('/:id/posts', userController.getPosts);
router.get('/:id/articles', passport.authenticate('jwt', {session: false}), userController.getArticles);

router.get('/:id', passport.authenticate('jwt', { session: false }), userController.profile);

router.post('/send/token', userController.sendMail);

module.exports = router;