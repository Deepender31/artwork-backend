const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    artworkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' },
    text: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema); 