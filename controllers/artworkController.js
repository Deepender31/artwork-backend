const Artwork = require("../models/Artwork");
const multer = require("multer");
const path = require("path");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/artworks"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

exports.createArtwork = async (req, res) => {
  try {
    // Validate input
    if (
      !req.body.title ||
      !req.body.description ||
      !req.file ||
      !req.body.price
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const artworkData = {
      ...req.body,
      image: req.file.path,
      price: parseFloat(req.body.price)
    };

    const artwork = new Artwork(artworkData);
    await artwork.save();
    res.status(201).json(artwork);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all artworks
exports.getAllArtworks = async (req, res) => {
  try {
    // Fetch all artworks and populate the artistId field but only artist name
    const artworks = await Artwork.find()
      .populate("artistId", "username firstName lastName profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName profileImage",
        },
      });
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get artwork which has most likes
exports.getMostLikedArtwork = async (req, res) => {
  try {
    const mostLikedArtwork = await Artwork.findOne({})
      .sort({ likes: -1 })
      .populate("artistId", "username firstName lastName profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName profileImage",
        },
      });
    res.json(mostLikedArtwork);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArtworks = async (req, res) => {
  try {
    // validate input
    if (!req.query.category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Fetch all artworks and populate the artistId field
    const artworks = await Artwork.find({
      category: req.query.category,
    })
      .populate("artistId", "username firstName lastName")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName profileImage",
        },
      });
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateArtwork = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If there's a new file, update the image path
    if (req.file) {
      updateData.image = req.file.path;
    }

    // Validate required fields
    if (
      !updateData.title ||
      !updateData.description ||
      (!updateData.image && !req.file) ||
      !updateData.price
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const artwork = await Artwork.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );
    
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.status(200).json(artwork);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteArtwork = async (req, res) => {
  try {
    // Validate input
    if (!req.params.id) {
      return res.status(400).json({ message: "Artwork ID is required" });
    }

    await Artwork.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Artwork deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all artworks of an artist
exports.getArtistArtworks = async (req, res) => {
  try {
    const { artistId } = req.params;
    //validate artistId
    if (!artistId) {
      return res.status(400).json({ message: "Artist ID is required" });
    }
    const artworks = await Artwork.find({ artistId })
      .populate("artistId", "username firstName lastName profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName profileImage",
        },
      });

    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate("artistId", "username firstName lastName profileImage")
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "firstName lastName profileImage",
      },
    });
    res.json(artwork);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

