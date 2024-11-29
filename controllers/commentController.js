const Comment = require('../models/Comment');
const Artwork = require('../models/Artwork');

exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate input
        if (!id) {
            return res.status(400).json({ message: 'Artwork ID is required' });
        }
        const { userId, text } = req.body;
        const comment = new Comment({ userId, artworkId: id, text });
        await comment.save();

        await Artwork.findByIdAndUpdate(id, { $push: { comments: comment._id } });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        // Validate input
        if (!id || !commentId) {
            return res.status(400).json({ message: 'Artwork ID and Comment ID are required' });
        }
        await Comment.findByIdAndDelete(commentId);
        await Artwork.findByIdAndUpdate(id, { $pull: { comments: commentId } });

        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 