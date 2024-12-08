const Artwork = require("../models/Artwork"); // Adjust the path as necessary

const checkArtworkOwnership = async (req, res, next) => {
  try {
    const artworkId = req.params.id;
    const userId = req.user.id; // Assuming user ID is stored in req.user after authentication

    const artwork = await Artwork.findById(artworkId); // Fetch the artwork by ID

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    if (artwork.artistId.toString() !== userId) {
      // Check if the artist ID matches the user ID
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { checkArtworkOwnership };
