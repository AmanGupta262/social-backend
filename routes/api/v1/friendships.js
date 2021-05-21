const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendsController = require('../../../controllers/api/v1/friendships_controller');

router.post('/:id/add', passport.authenticate('jwt', {session: false}), friendsController.add);

module.exports = router;