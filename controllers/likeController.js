const Artwork = require("../models/Artwork");

exports.likeArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    // Add validation for both id and userId
    if (!id || !userId) {
      return res.status(400).json({ message: "Artwork ID and User ID are required" });
    }

    
    //check like is already there
    const existingLike = await Artwork.findOne({ _id: id, likes: userId });
    if (existingLike) {
      return res.status(400).json({ message: "Artwork already liked" });
    }

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }  // This ensures we get the updated document back
    ).lean();  // Convert to plain JavaScript object

    // Debug log
    console.log('Updated artwork:', updatedArtwork);

    if (!updatedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.json({ 
      message: "Artwork liked",
      artwork: updatedArtwork 
    });
  } catch (error) {
    console.error('Error in likeArtwork:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.unlikeArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    //check like is already there
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const existingLike = await Artwork.findOne({ _id: id, likes: userId });
    if (!existingLike) {
      return res.status(400).json({ message: "Artwork not liked" });
    }

    await Artwork.findByIdAndUpdate(id, { $pull: { likes: userId } });

    res.json({ message: "Artwork unLiked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLikesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const likes = await Artwork.find({ likes: userId })
      .populate("artistId", "username firstName lastName")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName profileImage",
        },
      });
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
