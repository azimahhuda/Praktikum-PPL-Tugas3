const express = require("express");
const router = express.Router();
const songsController = require("../controllers/songsController");

// Endpoint
router.get("/", songsController.getAllSongs);
router.get("/:id", songsController.getSongById);
router.post("/", songsController.addSong);
router.put("/:id", songsController.updateSong);
router.delete("/:id", songsController.deleteSong);
router.get("/search/:penyanyi", songsController.getSongsBySinger);

module.exports = router;
