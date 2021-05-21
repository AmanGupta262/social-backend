const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/articles', require('./articles'));
router.use('/comments', require('./comments'));
router.use('/friends', require('./friendships'));

module.exports = router;