const Artwork = require('../models/Artwork');

exports.likeArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        await Artwork.findByIdAndUpdate(id, { $addToSet: { likes: userId } });

        res.json({ message: 'Artwork liked' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unlikeArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        await Artwork.findByIdAndUpdate(id, { $pull: { likes: userId } });

        res.json({ message: 'Artwork unliked' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 