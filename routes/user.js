const express = require('express');
const router = express.Router();
const { getUserWithArtworks, getUsersWithArtworks } = require('../controllers/userController');

router.get('/:userId', getUserWithArtworks);
router.get('/', getUsersWithArtworks);

module.exports = router; 