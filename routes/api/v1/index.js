const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {return res.status(200).json({message: 'pong'});});
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/articles', require('./articles'));
router.use('/comments', require('./comments'));
router.use('/friends', require('./friendships'));
router.use('/search', require('./search'));

module.exports = router;