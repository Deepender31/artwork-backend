const Artwork = require('../models/Artwork');

exports.createArtwork = async (req, res) => {
    try {
        // Validate input
        if (!req.body.title || !req.body.description || !req.body.image || !req.body.price) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        const artwork = new Artwork(req.body);
        await artwork.save();
        res.status(201).json(artwork);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getArtworks = async (req, res) => {
    try {
        // validate input
        if (!req.query.category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        // Fetch all artworks and populate the artistId field
        const artworks = await Artwork.find({ category: req.query.category }).populate('artistId');
        res.json(artworks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateArtwork = async (req, res) => {
    try {
        // Validate input
        if (!req.body.title || !req.body.description || !req.body.image || !req.body.price) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const artwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(artwork);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteArtwork = async (req, res) => {
    try { 
        // Validate input
        if (!req.params.id) {
            return res.status(400).json({ message: 'Artwork ID is required' });
        }

        await Artwork.findByIdAndDelete(req.params.id);
        res.json({ message: 'Artwork deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
}; 