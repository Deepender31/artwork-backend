const express = require('express');
const router = express.Router();
const { likeArtwork, unlikeArtwork, getLikesByUser } = require('../controllers/likeController');

router.post('/:id/like', likeArtwork);
router.post('/:id/unlike', unlikeArtwork);
router.get('/liked/:userId', getLikesByUser);

module.exports = router; 