const express = require('express');
const router = express.Router();
const { getUserWithArtworks, getAllArtist } = require("../controllers/userController");

router.get("/:userId", getUserWithArtworks);
router.get("/", getAllArtist);

module.exports = router;
