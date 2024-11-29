const express = require('express');
const router = express.Router();
const { createArtwork, getArtworks, updateArtwork, deleteArtwork } = require('../controllers/artworkController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { checkArtworkOwnership } = require('../middleware/checkOwnership');

router.post('/',authMiddleware ,createArtwork);
router.get('/', getArtworks);
router.put('/:id', authMiddleware, checkArtworkOwnership, updateArtwork);
router.delete('/:id', authMiddleware, checkArtworkOwnership, deleteArtwork);

module.exports = router; 