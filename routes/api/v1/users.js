const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../../../controllers/api/v1/user-controller');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/auth/google', passport.authenticate('google', { session: false,scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', { session: false,}), userController.createSession);

module.exports = router;