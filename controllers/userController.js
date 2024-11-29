const User = require('../models/User');
const Artwork = require('../models/Artwork');

exports.getUserWithArtworks = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find artworks by the user
        const artworks = await Artwork.find({ artistId: userId });

        // Respond with user and their artworks
        res.json({ user, artworks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsersWithArtworks = async (req, res) => {
    try {
        // Find distinct artist IDs from artworks
        const artistIds = await Artwork.distinct('artistId');

        // Find users with these artist IDs
        const users = await User.find({ _id: { $in: artistIds } });

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 