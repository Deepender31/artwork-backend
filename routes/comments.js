const express = require('express');
const router = express.Router();
const { addComment, deleteComment } = require('../controllers/commentController');

router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);

module.exports = router; 