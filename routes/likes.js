const express = require('express');
const router = express.Router();
const { likeArtwork, unlikeArtwork } = require('../controllers/likeController');

router.post('/:id/like', likeArtwork);
router.post('/:id/unlike', unlikeArtwork);

module.exports = router; 