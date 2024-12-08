const User = require("../models/User");
const Artwork = require("../models/Artwork");

exports.getUserWithArtworks = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find artworks by the user
    const artworks = await Artwork.find({ artistId: userId }).populate(
      "artistId",
      "username lastName firstName profileImage"
    );

    // Respond with user and their artworks
    res.json({ user, artworks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all artists
exports.getAllArtist = async (req, res) => {
  try {
    const artists = await User.find({ role: "artist" });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
