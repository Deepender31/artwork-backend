const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: String,
    profileImage: String,
    role: { type: String, enum: ['artist', 'user'], default: 'user' }
});

module.exports = mongoose.model('User', UserSchema); 