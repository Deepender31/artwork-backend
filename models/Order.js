const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    artworkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: Number,
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema); 