const express = require("express");
const router = express.Router();
const {
  createArtwork,
  getArtworks,
  getAllArtworks,
  updateArtwork,
  deleteArtwork,
  getArtistArtworks,
  getArtworkById,
} = require("../controllers/artworkController");
const {
  authMiddleware,
  artistAuthMiddleware,
} = require("../middleware/authMiddleware");
const { checkArtworkOwnership } = require("../middleware/checkOwnership");

router.post("/", authMiddleware, artistAuthMiddleware, createArtwork);
router.get("/", getAllArtworks);
//router to get artworks by category based on query parameter

router.get("/category", getArtworks);
router.put("/:id", authMiddleware, checkArtworkOwnership, updateArtwork);
router.delete("/:id", authMiddleware, checkArtworkOwnership, deleteArtwork);
router.get("/artist/:artistId", getArtistArtworks);
router.get("/:id", getArtworkById);
module.exports = router;
