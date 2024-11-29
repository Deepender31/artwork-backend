const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    image: String,
    price: Number,
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Artwork', ArtworkSchema); 